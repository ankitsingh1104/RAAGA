import { useState, useCallback } from "react";
import { Track } from "@/contexts/MusicPlayerContext";
import { useJamendoSearch } from "./useJamendoSearch";
import { useYouTubeSearch } from "./useYouTubeSearch";

export function useHybridSearch() {
  const [results, setResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"jamendo" | "youtube" | null>(null);

  const jamendo = useJamendoSearch();
  const youtube = useYouTubeSearch();

  const searchTracks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setSource(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First try Jamendo
      await jamendo.searchTracks(query);
      
      if (jamendo.results.length > 0) {
        const jamendoTracks = jamendo.results.map(t => ({ ...t, source: "jamendo" as const }));
        setResults(jamendoTracks);
        setSource("jamendo");
      } else {
        // Fallback to YouTube
        const youtubeTracks = await youtube.searchTracks(query);
        setResults(youtubeTracks);
        setSource("youtube");
      }
    } catch (err) {
      console.error("Hybrid search error:", err);
      setError(err instanceof Error ? err.message : "Search failed");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [jamendo, youtube]);

  const clearResults = useCallback(() => {
    setResults([]);
    setSource(null);
    setError(null);
    jamendo.clearResults();
    youtube.clearResults();
  }, [jamendo, youtube]);

  return {
    results,
    isLoading: isLoading || jamendo.isLoading || youtube.isLoading,
    error: error || jamendo.error || youtube.error,
    source,
    searchTracks,
    clearResults,
  };
}
