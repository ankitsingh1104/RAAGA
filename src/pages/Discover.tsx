import { useState, useEffect } from "react";
import { useMusicPlayer, Track } from "@/contexts/MusicPlayerContext";
import { fetchYouTubeData } from "@/hooks/useYouTubeData";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FavoritesMixCard } from "@/components/discover/FavoritesMixCard";
import { FeaturedSongCard } from "@/components/discover/FeaturedSongCard";
import { LikedSongsCard } from "@/components/discover/LikedSongsCard";
import { RecentlyPlayedTable } from "@/components/discover/RecentlyPlayedTable";
import { RecommendedSection } from "@/components/discover/RecommendedSection";
import { ScrollArea } from "@/components/ui/scroll-area";

const Discover = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [featuredTrack, setFeaturedTrack] = useState<Track | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    // Fetch English songs only with specific queries
    const englishQueries = [
      "top english pop songs 2024",
      "best english hits billboard",
      "english music trending songs"
    ];
    
    const randomQuery = englishQueries[Math.floor(Math.random() * englishQueries.length)];

    fetchYouTubeData(randomQuery, 15, controller.signal)
      .then((tracks) => {
        // Filter to ensure English content (basic filtering by common English patterns)
        const englishTracks = tracks.filter(track => {
          const title = track.title.toLowerCase();
          const artist = track.artist.toLowerCase();
          // Exclude obvious non-English indicators
          const nonEnglishPatterns = /[\u0900-\u097F]|[\u0980-\u09FF]|[\u0A00-\u0A7F]|[\u0B00-\u0B7F]/;
          return !nonEnglishPatterns.test(title) && !nonEnglishPatterns.test(artist);
        });
        
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <DashboardHeader />
          <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
            <div className="px-6 py-6 pb-32">
              {/* Made for you heading */}
              <h1 className="text-2xl font-bold text-foreground mb-6">Made for you</h1>
              
              {/* Main grid layout */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
                {/* Left column - Favorites Mix */}
                <div>
                  <FavoritesMixCard />
                </div>
                
                {/* Right column - Featured song + Liked songs */}
                <div className="flex flex-col gap-4">
                  <FeaturedSongCard 
                    track={featuredTrack} 
                    isLoading={isLoading}
                    playlist={recentlyPlayed}
                  />
                  <LikedSongsCard songCount={recentlyPlayed.length + 1} />
                </div>
              </div>
              
              {/* AI Recommended Section */}
              <RecommendedSection />

              {/* Recently Played section */}
              <RecentlyPlayedTable 
                tracks={recentlyPlayed} 
                isLoading={isLoading} 
              />
            </div>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Discover;
