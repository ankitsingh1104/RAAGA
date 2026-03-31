import { useState, useEffect } from "react";
import { useMusicPlayer, Track } from "@/contexts/MusicPlayerContext";
import { fetchYouTubeData } from "@/hooks/useYouTubeData";
import { FavoritesMixCard } from "@/components/discover/FavoritesMixCard";
import { FeaturedSongCard } from "@/components/discover/FeaturedSongCard";
import { LikedSongsCard } from "@/components/discover/LikedSongsCard";
import { RecentlyPlayedTable } from "@/components/discover/RecentlyPlayedTable";
import { RecommendedSection } from "@/components/discover/RecommendedSection";

const Discover = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [featuredTrack, setFeaturedTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const englishQueries = [
      "top english pop songs 2024",
      "best english hits billboard",
      "english music trending songs"
    ];
    
    const randomQuery = englishQueries[Math.floor(Math.random() * englishQueries.length)];

    fetchYouTubeData(randomQuery, 15, controller.signal)
      .then((tracks) => {
        const nonEnglishPatterns = /[\u0900-\u097F]|[\u0980-\u09FF]|[\u0A00-\u0A7F]|[\u0B00-\u0B7F]/;
        const englishTracks = tracks.filter(track =>
          !nonEnglishPatterns.test(track.title) && !nonEnglishPatterns.test(track.artist)
        );
        
        if (englishTracks.length > 0) {
          setFeaturedTrack(englishTracks[0]);
          setRecentlyPlayed(englishTracks.slice(1));
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch songs:", err);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="px-6 py-6 pb-32">
      <h1 className="text-2xl font-bold text-foreground mb-6">Made for you</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div>
          <FavoritesMixCard />
        </div>
        <div className="flex flex-col gap-4">
          <FeaturedSongCard 
            track={featuredTrack} 
            isLoading={isLoading}
            playlist={recentlyPlayed}
          />
          <LikedSongsCard songCount={recentlyPlayed.length + 1} />
        </div>
      </div>
      
      <RecommendedSection />

      <RecentlyPlayedTable 
        tracks={recentlyPlayed} 
        isLoading={isLoading} 
      />
    </div>
  );
};

export default Discover;
