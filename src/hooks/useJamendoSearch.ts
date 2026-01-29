import { useState, useCallback } from "react";
import { Track } from "@/contexts/MusicPlayerContext";

const JAMENDO_CLIENT_ID = "d4a4b8f5";
const JAMENDO_API_BASE = "https://api.jamendo.com/v3.0";

interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  audio: string;
  duration: number;
}

interface JamendoResponse {
  results: JamendoTrack[];
}

export function useJamendoSearch() {
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTracks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `${JAMENDO_API_BASE}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&search=${encodedQuery}&include=musicinfo`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }

      const data: JamendoResponse = await response.json();

      const tracks: Track[] = data.results.map((track) => ({
        id: parseInt(track.id, 10),
        title: track.name,
        artist: track.artist_name,
        album: track.album_name,
        cover: track.album_image || "/placeholder.svg",
        audioUrl: track.audio,
        duration: track.duration,
      }));

      setResults(tracks);
    } catch (err) {
      console.error("Search error:", err);
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
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
