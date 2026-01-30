import { useState, useCallback } from "react";
import { Track } from "@/contexts/MusicPlayerContext";

const YOUTUBE_API_KEY = "AIzaSyDbT3wtD_Pin4bDrexoFWMYEjZO103BVWw";
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

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

interface YouTubeSearchResponse {
  items: YouTubeSearchResult[];
}

// Clean YouTube title by removing common suffixes
function cleanTitle(title: string): string {
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

export function useYouTubeSearch() {
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTracks = useCallback(async (query: string): Promise<Track[]> => {
    if (!query.trim()) {
      setResults([]);
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const encodedQuery = encodeURIComponent(`${query} music`);
      const response = await fetch(
        `${YOUTUBE_API_BASE}/search?part=snippet&q=${encodedQuery}&type=video&videoCategoryId=10&maxResults=20&key=${YOUTUBE_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch YouTube tracks");
      }

      const data: YouTubeSearchResponse = await response.json();

      const tracks: Track[] = data.items.map((item) => {
        // Generate a numeric ID from the videoId string
        const numericId = Math.abs(
          item.id.videoId.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)
        );
        return {
          id: numericId,
          title: cleanTitle(item.snippet.title),
          artist: item.snippet.channelTitle.replace(/\s*-\s*Topic$/i, ""),
          cover: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
          youtubeId: item.id.videoId,
          source: "youtube" as const,
        };
      });

      setResults(tracks);
      return tracks;
    } catch (err) {
      console.error("YouTube search error:", err);
      setError(err instanceof Error ? err.message : "YouTube search failed");
      setResults([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
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
