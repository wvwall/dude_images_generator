import { useState, useCallback } from "react";

/**
 * Stati possibili del fetcher
 */
export type FetcherStatus = "idle" | "pending" | "success" | "error";

/**
 * Risultato del fetcher hook
 */
export interface FetcherResult<T> {
  data: T | null;
  error: Error | null;
  status: FetcherStatus;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Opzioni per il fetcher
 */
export interface FetcherOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}

/**
 * Hook per gestire le chiamate fetch con stati success, error e pending
 *
 * @param fetchFn - Funzione che esegue la chiamata API
 * @param options - Opzioni opzionali per callbacks
 * @returns FetcherResult con dati, errore, stati e funzioni di controllo
 *
 * @example
 * const { data, isPending, isError, execute } = useFetcher(
 *   async (id: string) => {
 *     const res = await fetch(api.backend.images.getById(id));
 *     return res.json();
 *   },
 *   {
 *     onSuccess: (data) => console.log('Success:', data),
 *     onError: (error) => console.error('Error:', error),
 *   }
 * );
 *
 * // Esegui la chiamata
 * await execute('123');
 */
export function useFetcher<T, Args extends unknown[] = unknown[]>(
  fetchFn: (...args: Args) => Promise<T>,
  options?: FetcherOptions<T>
): FetcherResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<FetcherStatus>("idle");

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setStatus("idle");
  }, []);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      try {
        setStatus("pending");
        setError(null);

        const result = await fetchFn(...args);

        setData(result);
        setStatus("success");
        options?.onSuccess?.(result);

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setStatus("error");
        options?.onError?.(error);

        return null;
      } finally {
        options?.onSettled?.();
      }
    },
    [fetchFn, options]
  );

  return {
    data,
    error,
    status,
    isIdle: status === "idle",
    isPending: status === "pending",
    isSuccess: status === "success",
    isError: status === "error",
    execute: execute as (...args: unknown[]) => Promise<T | null>,
    reset,
  };
}

/**
 * Hook semplificato per fetch GET
 *
 * @example
 * const { data, isPending, execute } = useGet<Image[]>(api.backend.images.getAll());
 */
export function useGet<T>(
  url: string,
  options?: FetcherOptions<T>
): FetcherResult<T> {
  return useFetcher<T>(async () => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }, options);
}

/**
 * Hook semplificato per fetch POST
 *
 * @example
 * const { execute, isPending } = usePost<Image>(api.backend.images.create());
 * await execute({ prompt: 'A beautiful sunset' });
 */
export function usePost<T, Body = unknown>(
  url: string,
  options?: FetcherOptions<T>
): FetcherResult<T> {
  return useFetcher<T, [Body]>(async (body: Body) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }, options);
}

/**
 * Hook semplificato per fetch PUT
 */
export function usePut<T, Body = unknown>(
  url: string,
  options?: FetcherOptions<T>
): FetcherResult<T> {
  return useFetcher<T, [Body]>(async (body: Body) => {
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }, options);
}

/**
 * Hook semplificato per fetch DELETE
 */
export function useDelete<T>(
  url: string,
  options?: FetcherOptions<T>
): FetcherResult<T> {
  return useFetcher<T>(async () => {
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  }, options);
}
