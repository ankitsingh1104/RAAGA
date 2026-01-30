import { useRef, useCallback } from "react";
import { Track } from "@/contexts/MusicPlayerContext";

interface CacheEntry {
  jamendo: Track[];
  youtube: Track[];
  timestamp: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useSearchCache() {
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  const get = useCallback((query: string): CacheEntry | null => {
    const normalizedQuery = query.toLowerCase().trim();
    const entry = cacheRef.current.get(normalizedQuery);
    
    if (!entry) return null;
    
    // Check if cache is still valid
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      cacheRef.current.delete(normalizedQuery);
      return null;
    }
    
    return entry;
  }, []);

  const set = useCallback((query: string, jamendo: Track[], youtube: Track[]) => {
    const normalizedQuery = query.toLowerCase().trim();
    cacheRef.current.set(normalizedQuery, {
      jamendo,
      youtube,
      timestamp: Date.now(),
    });
    
    // Limit cache size to prevent memory bloat
    if (cacheRef.current.size > 50) {
      const firstKey = cacheRef.current.keys().next().value;
      if (firstKey) cacheRef.current.delete(firstKey);
    }
  }, []);

  const clear = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { get, set, clear };
}
