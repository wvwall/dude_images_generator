import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import { GeneratedImage } from "../types";
import type { SqlJsStatic, Database } from "sql.js";

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

async function ensureDbInitialized() {
  if (db) return;
  // Use Vite's URL import so the wasm is served with correct MIME type.
  SQL = await initSqlJs({ locateFile: () => wasmUrl });

  const saved = localStorage.getItem("dude_db");
  if (saved) {
    // restore DB from base64
    const binaryString = atob(saved);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    db = new SQL.Database(bytes);
  } else {
    // Try IndexedDB fallback
    try {
      const u8 = await loadFromIndexedDB();
      if (u8 && u8.length > 0) {
        db = new SQL.Database(u8);
        return;
      }
    } catch (e) {
      console.warn("Failed reading DB from IndexedDB:", e);
    }
    db = new SQL.Database();
    db.run(
      "CREATE TABLE IF NOT EXISTS images (id TEXT PRIMARY KEY, url TEXT, prompt TEXT, timestamp INTEGER, aspectRatio TEXT)"
    );
    persist();
  }
}

function persist() {
  const binary: Uint8Array = db.export();

  // Convert Uint8Array to base64 in chunks to avoid call-stack/argument limits
  function uint8ToBase64(u8: Uint8Array) {
    const CHUNK_SIZE = 0x8000; // 32KB
    let result = "";
    for (let i = 0; i < u8.length; i += CHUNK_SIZE) {
      const chunk = u8.subarray(i, i + CHUNK_SIZE);
      // convert chunk to regular array for apply
      const arr = Array.prototype.slice.call(chunk) as number[];
      result += String.fromCharCode.apply(null, arr as any);
    }
    return btoa(result);
  }

  const b64 = uint8ToBase64(binary);
  try {
    localStorage.setItem("dude_db", b64);
  } catch (err) {
    console.error(
      "Failed to persist DB to localStorage (quota?), falling back to IndexedDB:",
      err
    );
    // Try IndexedDB fallback
    try {
      const buffer = binary.buffer.slice(
        binary.byteOffset,
        binary.byteOffset + binary.byteLength
      );
      persistToIndexedDB(buffer as ArrayBuffer).catch((e) =>
        console.error("IndexedDB persist failed:", e)
      );
    } catch (e) {
      console.error("Could not create buffer for IndexedDB persist:", e);
    }
  }
}

async function persistToIndexedDB(arrayBuffer: ArrayBuffer) {
  return new Promise<void>((resolve, reject) => {
    const req = indexedDB.open("dude_images_db", 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("sqlite"))
        db.createObjectStore("sqlite");
    };
    req.onsuccess = () => {
      const idb = req.result;
      const tx = idb.transaction("sqlite", "readwrite");
      const store = tx.objectStore("sqlite");
      const putReq = store.put(arrayBuffer, "dude_db");
      putReq.onsuccess = () => {
        resolve();
      };
      putReq.onerror = () => reject(putReq.error);
      tx.oncomplete = () => idb.close();
    };
    req.onerror = () => reject(req.error);
  });
}

async function loadFromIndexedDB(): Promise<Uint8Array | null> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("dude_images_db", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("sqlite");
    req.onsuccess = () => {
      const idb = req.result;
      const tx = idb.transaction("sqlite", "readonly");
      const store = tx.objectStore("sqlite");
      const getReq = store.get("dude_db");
      getReq.onsuccess = () => {
        const result = getReq.result;
        if (!result) {
          resolve(null);
          idb.close();
          return;
        }
        // result should be an ArrayBuffer
        const u8 = new Uint8Array(result);
        resolve(u8);
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
  const res = db.exec(
    "SELECT id, url, prompt, timestamp, aspectRatio FROM images ORDER BY timestamp DESC"
  );
  if (!res || res.length === 0) return [];
  const cols = res[0].columns;
  const values = res[0].values;
  return values.map((row: any[]) => {
    const obj: any = {};
    row.forEach((val, idx) => {
      obj[cols[idx]] = val;
    });
    return obj as GeneratedImage;
  });
}

export async function addImage(img: GeneratedImage) {
  await ensureDbInitialized();
  const stmt = db.prepare(
    "INSERT OR REPLACE INTO images (id, url, prompt, timestamp, aspectRatio) VALUES (?, ?, ?, ?, ?)"
  );
  stmt.run([img.id, img.url, img.prompt, img.timestamp, img.aspectRatio]);
  stmt.free();
  persist();
}

export async function deleteImage(id: string) {
  await ensureDbInitialized();
  const stmt = db.prepare("DELETE FROM images WHERE id = ?");
  stmt.run([id]);
  stmt.free();
  persist();
}

export async function clearAll() {
  await ensureDbInitialized();
  db.run("DELETE FROM images");
  persist();
}

export default {
  initDB,
  getAllImages,
  addImage,
  deleteImage,
  clearAll,
};
