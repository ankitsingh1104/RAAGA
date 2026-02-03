import { useState, useCallback, useRef, useEffect } from "react";
import { Track } from "@/contexts/MusicPlayerContext";

const YOUTUBE_API_KEY = "AIzaSyDbT3wtD_Pin4bDrexoFWMYEjZO103BVWw";
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<Track[]>>();

function cleanYouTubeTitle(title: string): { songTitle: string; artist: string } {
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
    .replace(/\(full\s*song\)/gi, "")
    .replace(/\[full\s*song\]/gi, "")
    .replace(/\(visualizer\)/gi, "")
    .replace(/\[visualizer\]/gi, "")
    .replace(/\(music video\)/gi, "")
    .replace(/\[music video\]/gi, "")
    .replace(/official\s*video/gi, "")
    .replace(/official\s*audio/gi, "")
    .replace(/lyric\s*video/gi, "")
    .replace(/full\s*song/gi, "")
    .replace(/\s+/g, " ")
    .trim();

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

function generateNumericId(videoId: string): number {
  return Math.abs(
    videoId.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
  );
}

interface YouTubeSearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      high: { url: string };
      medium: { url: string };
      default: { url: string };
    };
  };
}

async function fetchYouTubeData(
  query: string,
  maxResults: number = 10,
  signal?: AbortSignal
): Promise<Track[]> {
  const cacheKey = `${query}-${maxResults}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const encodedQuery = encodeURIComponent(`${query} music`);
  const response = await fetch(
    `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodedQuery}&type=video&videoCategoryId=10&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`,
    { signal }
  );

  if (!response.ok) {
    throw new Error("YouTube API request failed");
  }

  const data = await response.json();

  const tracks: Track[] = data.items.map((item: YouTubeSearchResult) => {
    const { songTitle, artist } = cleanYouTubeTitle(item.snippet.title);
    const channelArtist = item.snippet.channelTitle
      .replace(/\s*-\s*Topic$/i, "")
      .replace(/VEVO$/i, "")
      .trim();

    return {
      id: generateNumericId(item.id.videoId),
      title: songTitle || item.snippet.title,
      artist: artist || channelArtist,
      cover: item.snippet.thumbnails.high?.url || 
             item.snippet.thumbnails.medium?.url || 
             item.snippet.thumbnails.default?.url,
      youtubeId: item.id.videoId,
      source: "youtube" as const,
    };
  });

  cache.set(cacheKey, { data: tracks, timestamp: Date.now() });
  return tracks;
}

export function useYouTubeData(query: string, maxResults: number = 10) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!query) {
      setTracks([]);
      setIsLoading(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    fetchYouTubeData(query, maxResults, abortRef.current.signal)
      .then((data) => {
        setTracks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("YouTube fetch error:", err);
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      abortRef.current?.abort();
    };
  }, [query, maxResults]);

  return { tracks, isLoading, error };
}

export function useMultipleYouTubeData(queries: { key: string; query: string; maxResults?: number }[]) {
  const [data, setData] = useState<Record<string, Track[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const initialLoading: Record<string, boolean> = {};
    queries.forEach(q => { initialLoading[q.key] = true; });
    setLoading(initialLoading);

    const abortController = new AbortController();

    queries.forEach(({ key, query, maxResults = 6 }) => {
      fetchYouTubeData(query, maxResults, abortController.signal)
        .then((tracks) => {
          setData(prev => ({ ...prev, [key]: tracks }));
          setLoading(prev => ({ ...prev, [key]: false }));
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            setErrors(prev => ({ ...prev, [key]: err.message }));
            setLoading(prev => ({ ...prev, [key]: false }));
          }
        });
    });

    return () => {
      abortController.abort();
    };
  }, [JSON.stringify(queries)]);

  return { data, loading, errors };
}

export { fetchYouTubeData, cleanYouTubeTitle };
