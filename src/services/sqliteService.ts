import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import { GeneratedImage } from "../types";
import type { SqlJsStatic, Database } from "sql.js";

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

// Constant name for the store
const DB_NAME = "dude_images_db";
const STORE_NAME = "sqlite";
const KEY_NAME = "dude_db";

async function ensureDbInitialized() {
  if (db) return;

  SQL = await initSqlJs({ locateFile: () => wasmUrl });

  // 1. Try to load ONLY from IndexedDB
  try {
    const u8 = await loadFromIndexedDB();
    if (u8 && u8.length > 0) {
      db = new SQL.Database(u8);
      // Optional cleanup: Remove old leftovers from localStorage to avoid future confusion
      localStorage.removeItem("dude_db");
      return;
    }
  } catch (e) {
    console.warn("Failed reading DB from IndexedDB, creating new:", e);
  }

  // 2. If it doesn't exist, create a new one
  db = new SQL.Database();
  db.run(
    "CREATE TABLE IF NOT EXISTS images (id TEXT PRIMARY KEY, url TEXT, prompt TEXT, timestamp INTEGER, aspectRatio TEXT)"
  );
  // Immediately save the initial empty state
  await persist();
}

// Asynchronous persist function
async function persist() {
  if (!db) return;
  const binary: Uint8Array = db.export();

  // Save the binary buffer directly to IndexedDB
  // No base64 needed, no localStorage needed
  try {
    await persistToIndexedDB(binary);
  } catch (e) {
    console.error("IndexedDB persist failed:", e);
  }
}

function persistToIndexedDB(data: Uint8Array): Promise<void> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    req.onsuccess = () => {
      const idb = req.result;
      const tx = idb.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      // IndexedDB natively handles Uint8Array/Blob
      const putReq = store.put(data, KEY_NAME);

      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);

      tx.oncomplete = () => idb.close();
    };

    req.onerror = () => reject(req.error);
  });
}

function loadFromIndexedDB(): Promise<Uint8Array | null> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);

    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore(STORE_NAME);
    };

    req.onsuccess = () => {
      const idb = req.result;
      const tx = idb.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(KEY_NAME);

      getReq.onsuccess = () => {
        const result = getReq.result;
        if (!result) {
          resolve(null);
        } else {
          // Make sure it is a Uint8Array
          if (result instanceof Uint8Array) {
            resolve(result);
          } else {
            // Fallback if saved as ArrayBuffer
            resolve(new Uint8Array(result));
          }
        }
        idb.close();
      };

      getReq.onerror = () => reject(getReq.error);
    };

    req.onerror = () => reject(req.error);
  });
}

export async function initDB() {
  await ensureDbInitialized();
}

export async function getAllImages(): Promise<GeneratedImage[]> {
  await ensureDbInitialized();
  if (!db) return [];
  try {
    const res = db.exec(
      "SELECT id, url, prompt, timestamp, aspectRatio FROM images ORDER BY timestamp DESC"
    );
    if (!res || res.length === 0) return [];
    const cols = res[0].columns;
    const values = res[0].values;
    return values.map((row: any[]) => {
      const obj: any = {};
      row.forEach((val: any, idx: number) => {
        obj[cols[idx]] = val;
      });
      return obj as GeneratedImage;
    });
  } catch (e) {
    console.error("Error fetching images", e);
    return [];
  }
}

export async function getImageById(id: string): Promise<GeneratedImage | null> {
  await ensureDbInitialized();
  if (!db) return null;
  try {
    const stmt = db.prepare(
      "SELECT id, url, prompt, timestamp, aspectRatio FROM images WHERE id = ?"
    );
    stmt.bind([id]);
    if (stmt.step()) {
      const row = stmt.getAsObject();
      stmt.free();
      const obj: any = {};
      Object.keys(row).forEach((key) => {
        obj[key] = (row as any)[key];
      });
      return obj as GeneratedImage;
    } else {
      stmt.free();
      return null;
    }
  } catch (e) {
    console.error("Error fetching image by ID", e);
    return null;
  }
}

export async function addImage(img: GeneratedImage) {
  await ensureDbInitialized();
  if (!db) throw new Error("DB not initialized");

  const stmt = db.prepare(
    "INSERT OR REPLACE INTO images (id, url, prompt, timestamp, aspectRatio) VALUES (?, ?, ?, ?, ?)"
  );
  stmt.run([img.id, img.url, img.prompt, img.timestamp, img.aspectRatio]);
  stmt.free();

  // Note: persist is now asynchronous, but we can call it without await
  // if we don't want to block the UI, as long as we handle errors internally.
  // However, await is better if we want to be sure it's saved.
  await persist();
}

export async function deleteImage(id: string) {
  await ensureDbInitialized();
  if (!db) return;
  const stmt = db.prepare("DELETE FROM images WHERE id = ?");
  stmt.run([id]);
  stmt.free();
  await persist();
}

export async function clearAll() {
  await ensureDbInitialized();
  if (!db) return;
  db.run("DELETE FROM images");
  await persist();
}

export default {
  initDB,
  getAllImages,
  addImage,
  deleteImage,
  clearAll,
};
