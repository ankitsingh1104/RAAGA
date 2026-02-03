import { useState, useCallback, useRef } from "react";
import { Track } from "@/contexts/MusicPlayerContext";

const YOUTUBE_API_KEY = "AIzaSyDbT3wtD_Pin4bDrexoFWMYEjZO103BVWw";
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const MAX_RESULTS = 10;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface YouTubeSearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high: { url: string };
      medium: { url: string };
    };
  };
}

interface CacheEntry {
  results: Track[];
  timestamp: number;
}

function cleanYouTubeTitle(title: string): { songTitle: string; artist: string } {
  // Common patterns to remove
  let cleaned = title
    .replace(/\(official\s*(music\s*)?video\)/gi, "")
    .replace(/\[official\s*(music\s*)?video\]/gi, "")
    .replace(/\(official\s*audio\)/gi, "")
    .replace(/\[official\s*audio\]/gi, "")
    .replace(/\(lyrics?\s*(video)?\)/gi, "")
    .replace(/\[lyrics?\s*(video)?\]/gi, "")
    .replace(/\(audio\)/gi, "")
    .replace(/\[audio\]/gi, "")
    .replace(/\(hd\)/gi, "")
    .replace(/\[hd\]/gi, "")
    .replace(/\(4k\)/gi, "")
    .replace(/\[4k\]/gi, "")
    .replace(/\(visualizer\)/gi, "")
    .replace(/\[visualizer\]/gi, "")
    .replace(/\(music video\)/gi, "")
    .replace(/\[music video\]/gi, "")
    .replace(/official\s*video/gi, "")
    .replace(/official\s*audio/gi, "")
    .replace(/lyric\s*video/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  // Try to split artist - song title
  const separators = [" - ", " – ", " — ", " | "];
  for (const sep of separators) {
    if (cleaned.includes(sep)) {
      const [artist, ...rest] = cleaned.split(sep);
      return {
        artist: artist.trim(),
        songTitle: rest.join(sep).trim(),
      };
    }
  }

  return { songTitle: cleaned, artist: "" };
}

export function useYouTubeSearch() {
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());

  const getCached = (query: string): Track[] | null => {
    const entry = cacheRef.current.get(query.toLowerCase());
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.results;
    }
    return null;
  };

  const setCache = (query: string, tracks: Track[]) => {
    cacheRef.current.set(query.toLowerCase(), {
      results: tracks,
      timestamp: Date.now(),
    });
  };

  const searchTracks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    // Check cache first
    const cached = getCached(query);
    if (cached) {
      setResults(cached);
      setIsLoading(false);
      return;
    }

    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsLoading(true);
    setError(null);

    try {
      const encodedQuery = encodeURIComponent(`${query} music`);
      const response = await fetch(
        `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodedQuery}&type=video&videoCategoryId=10&maxResults=${MAX_RESULTS}&key=${YOUTUBE_API_KEY}`,
        { signal }
      );

      if (!response.ok) {
        throw new Error("YouTube search failed");
      }

      const data = await response.json();
      
      const tracks: Track[] = data.items.map((item: YouTubeSearchResult) => {
        const { songTitle, artist } = cleanYouTubeTitle(item.snippet.title);
        const channelArtist = item.snippet.channelTitle.replace(/\s*-\s*Topic$/i, "").replace(/VEVO$/i, "").trim();
        
        // Generate numeric ID from videoId
        const numericId = Math.abs(
          item.id.videoId.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
        );

        return {
          id: numericId,
          title: songTitle || item.snippet.title,
          artist: artist || channelArtist,
          cover: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
          youtubeId: item.id.videoId,
          source: "youtube" as const,
        };
      });

      if (!signal.aborted) {
        setResults(tracks);
        setCache(query, tracks);
        setIsLoading(false);
      }
    } catch (err) {
      if (!signal.aborted) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("YouTube search error:", err);
          setError(err.message);
        }
        setIsLoading(false);
      }
    }
  }, []);

  const clearResults = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setResults([]);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    results,
    isLoading,
    error,
    searchTracks,
    clearResults,
  };
}
