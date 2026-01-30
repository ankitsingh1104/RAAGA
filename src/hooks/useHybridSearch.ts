import { useState, useCallback, useRef } from "react";
import { Track } from "@/contexts/MusicPlayerContext";
import { useSearchCache } from "./useSearchCache";

const JAMENDO_CLIENT_ID = "d4a4b8f5";
const JAMENDO_API_BASE = "https://api.jamendo.com/v3.0";
const YOUTUBE_API_KEY = "AIzaSyDbT3wtD_Pin4bDrexoFWMYEjZO103BVWw";
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

const MAX_JAMENDO_RESULTS = 5;
const MAX_YOUTUBE_RESULTS = 5;

interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  audio: string;
  duration: number;
}

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

function cleanYouTubeTitle(title: string): string {
  return title
    .replace(/\(official\s*(music\s*)?video\)/gi, "")
    .replace(/\[official\s*(music\s*)?video\]/gi, "")
    .replace(/\(official\s*audio\)/gi, "")
    .replace(/\[official\s*audio\]/gi, "")
    .replace(/\(lyrics?\)/gi, "")
    .replace(/\[lyrics?\]/gi, "")
    .replace(/\(audio\)/gi, "")
    .replace(/\[audio\]/gi, "")
    .replace(/\(hd\)/gi, "")
    .replace(/\[hd\]/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function useHybridSearch() {
  const [jamendoResults, setJamendoResults] = useState<Track[]>([]);
  const [youtubeResults, setYoutubeResults] = useState<Track[]>([]);
  const [jamendoLoading, setJamendoLoading] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cache = useSearchCache();

  const searchJamendo = async (query: string, signal: AbortSignal): Promise<Track[]> => {
    const encodedQuery = encodeURIComponent(query);
    const response = await fetch(
      `${JAMENDO_API_BASE}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${MAX_JAMENDO_RESULTS}&search=${encodedQuery}&include=musicinfo`,
      { signal }
    );

    if (!response.ok) throw new Error("Jamendo search failed");

    const data = await response.json();
    return data.results.map((track: JamendoTrack) => ({
      id: parseInt(track.id, 10),
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      cover: track.album_image || "/placeholder.svg",
      audioUrl: track.audio,
      duration: track.duration,
      source: "jamendo" as const,
    }));
  };

  const searchYouTube = async (query: string, signal: AbortSignal): Promise<Track[]> => {
    const encodedQuery = encodeURIComponent(`${query} music`);
    const response = await fetch(
      `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodedQuery}&type=video&videoCategoryId=10&maxResults=${MAX_YOUTUBE_RESULTS}&key=${YOUTUBE_API_KEY}`,
      { signal }
    );

    if (!response.ok) throw new Error("YouTube search failed");

    const data = await response.json();
    return data.items.map((item: YouTubeSearchResult) => {
      const numericId = Math.abs(
        item.id.videoId.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
      );
      return {
        id: numericId,
        title: cleanYouTubeTitle(item.snippet.title),
        artist: item.snippet.channelTitle.replace(/\s*-\s*Topic$/i, ""),
        cover: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
        youtubeId: item.id.videoId,
        source: "youtube" as const,
      };
    });
  };

  const searchTracks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setJamendoResults([]);
      setYoutubeResults([]);
      return;
    }

    // Check cache first
    const cached = cache.get(query);
    if (cached) {
      setJamendoResults(cached.jamendo);
      setYoutubeResults(cached.youtube);
      return;
    }

    // Cancel any pending requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Start loading immediately
    setJamendoLoading(true);
    setYoutubeLoading(true);
    setError(null);

    // Run searches in parallel - results stream in as they complete
    const jamendoPromise = searchJamendo(query, signal)
      .then((tracks) => {
        if (!signal.aborted) {
          setJamendoResults(tracks);
          setJamendoLoading(false);
        }
        return tracks;
      })
      .catch((err) => {
        if (!signal.aborted && err.name !== "AbortError") {
          console.error("Jamendo search error:", err);
          setJamendoLoading(false);
        }
        return [] as Track[];
      });

    const youtubePromise = searchYouTube(query, signal)
      .then((tracks) => {
        if (!signal.aborted) {
          setYoutubeResults(tracks);
          setYoutubeLoading(false);
        }
        return tracks;
      })
      .catch((err) => {
        if (!signal.aborted && err.name !== "AbortError") {
          console.error("YouTube search error:", err);
          setYoutubeLoading(false);
        }
        return [] as Track[];
      });

    // Cache results after both complete
    Promise.all([jamendoPromise, youtubePromise]).then(([jamendo, youtube]) => {
      if (!signal.aborted && (jamendo.length > 0 || youtube.length > 0)) {
        cache.set(query, jamendo, youtube);
      }
    });
  }, [cache]);

  const clearResults = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setJamendoResults([]);
    setYoutubeResults([]);
    setJamendoLoading(false);
    setYoutubeLoading(false);
    setError(null);
  }, []);

  // Combine results for backward compatibility
  const results = [...jamendoResults, ...youtubeResults];
  const isLoading = jamendoLoading || youtubeLoading;

  return {
    results,
    jamendoResults,
    youtubeResults,
    isLoading,
    jamendoLoading,
    youtubeLoading,
    error,
    searchTracks,
    clearResults,
  };
}
