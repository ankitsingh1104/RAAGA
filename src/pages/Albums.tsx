import { useState, useEffect } from "react";
import { ChevronRight, ArrowLeft, Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionCarousel } from "@/components/discover/SectionCarousel";
import { GenreCard } from "@/components/discover/GenreCard";
import { MoodPlaylistCard } from "@/components/discover/MoodPlaylistCard";
import { useMultipleYouTubeData, fetchYouTubeData } from "@/hooks/useYouTubeData";
import { useMusicPlayer, Track } from "@/contexts/MusicPlayerContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

const genreQueries = [
  { key: "rap", query: "rap hip hop hits 2024", title: "Rap Tracks" },
  { key: "pop", query: "pop music hits 2024", title: "Pop Tracks" },
  { key: "rock", query: "rock music hits 2024", title: "Rock Tracks" },
  { key: "classic", query: "classical music popular", title: "Classic Tracks" },
];

const moodQueries = [
  { key: "sad", query: "sad emotional songs", title: "Sad Playlist" },
  { key: "chill", query: "chill relaxing music", title: "Chill Playlist" },
  { key: "workout", query: "workout gym music", title: "Workout Playlist" },
  { key: "love", query: "romantic love songs", title: "Love Playlist" },
  { key: "happy", query: "happy upbeat songs", title: "Happy Playlist" },
];

const Albums = () => {
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();

  const [genreData, setGenreData] = useState<Record<string, Track[]>>({});
  const [moodData, setMoodData] = useState<Record<string, Track[]>>({});
  const [genreLoading, setGenreLoading] = useState(true);
  const [moodLoading, setMoodLoading] = useState(true);

  const { data, loading } = useMultipleYouTubeData([
    { key: "artists", query: "popular music artists songs 2024", maxResults: 6 },
    { key: "videos", query: "popular music videos 2024", maxResults: 6 },
    { key: "newRelease", query: "new release songs 2024", maxResults: 6 },
    { key: "topAlbums", query: "top album songs 2024", maxResults: 6 },
  ]);

  // Fetch genre data
  useEffect(() => {
    const controller = new AbortController();
    
    Promise.all(
      genreQueries.map(({ key, query }) =>
        fetchYouTubeData(query, 4, controller.signal)
          .then((tracks) => ({ key, tracks }))
          .catch(() => ({ key, tracks: [] }))
      )
    ).then((results) => {
      const genreMap: Record<string, Track[]> = {};
      results.forEach(({ key, tracks }) => {
        genreMap[key] = tracks;
      });
      setGenreData(genreMap);
      setGenreLoading(false);
    });

    return () => controller.abort();
  }, []);

  // Fetch mood data
  useEffect(() => {
    const controller = new AbortController();
    
    Promise.all(
      moodQueries.map(({ key, query }) =>
        fetchYouTubeData(query, 4, controller.signal)
          .then((tracks) => ({ key, tracks }))
          .catch(() => ({ key, tracks: [] }))
      )
    ).then((results) => {
      const moodMap: Record<string, Track[]> = {};
      results.forEach(({ key, tracks }) => {
        moodMap[key] = tracks;
      });
      setMoodData(moodMap);
      setMoodLoading(false);
    });

    return () => controller.abort();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <DashboardHeader />
          <ScrollArea className="flex-1 h-[calc(100vh-80px)] pb-24">
            <main className="pb-8">
              {/* Music Genres */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4 px-6">
                  <h2 className="text-xl font-bold">
                    <span className="text-foreground">Music </span>
                    <span className="text-primary">Genres</span>
                  </h2>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-4 px-6 pb-4">
                    {genreLoading
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton key={i} className="w-[160px] h-[100px] rounded-lg flex-shrink-0" />
                        ))
                      : genreQueries.map(({ key, title }) => (
                          <GenreCard
                            key={key}
                            title={title}
                            image={genreData[key]?.[0]?.cover || "/placeholder.svg"}
                            tracks={genreData[key] || []}
                          />
                        ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </section>

              {/* Mood Playlist */}
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4 px-6">
                  <h2 className="text-xl font-bold">
                    <span className="text-foreground">Mood </span>
                    <span className="text-primary">Playlist</span>
                  </h2>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    View All
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-4 px-6 pb-4">
                    {moodLoading
                      ? Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="w-[120px] flex-shrink-0">
                            <Skeleton className="aspect-square rounded-lg" />
                            <Skeleton className="h-3 w-3/4 mt-2 mx-auto" />
                          </div>
                        ))
                      : moodQueries.map(({ key, title }) => (
                          <MoodPlaylistCard
                            key={key}
                            title={title}
                            image={moodData[key]?.[0]?.cover || "/placeholder.svg"}
                            tracks={moodData[key] || []}
                          />
                        ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </section>

              {/* Popular Artists */}
              <SectionCarousel
                title="Popular Artists"
                highlightedWord="Artists"
                tracks={data.artists || []}
                isLoading={loading.artists}
                variant="round"
              />

              {/* Music Videos */}
              <SectionCarousel
                title="Music Video"
                highlightedWord="Video"
                tracks={data.videos || []}
                isLoading={loading.videos}
                variant="video"
              />

              {/* New Release Songs */}
              <SectionCarousel
                title="New Release Songs"
                highlightedWord="Songs"
                tracks={data.newRelease || []}
                isLoading={loading.newRelease}
                variant="default"
              />

              {/* Top Albums */}
              <SectionCarousel
                title="Top Albums"
                highlightedWord="Albums"
                tracks={data.topAlbums || []}
                isLoading={loading.topAlbums}
                variant="album"
              />

              {/* Footer */}
              <footer className="mt-12 px-6 py-8 border-t border-border/30">
                <div className="flex flex-wrap justify-between gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-4">RAAGA</h3>
                    <div className="flex gap-3 text-muted-foreground">
                      <span className="cursor-pointer hover:text-foreground">📱</span>
                      <span className="cursor-pointer hover:text-foreground">📷</span>
                      <span className="cursor-pointer hover:text-foreground">🐦</span>
                      <span className="cursor-pointer hover:text-foreground">📞</span>
                    </div>
                  </div>
                  <div className="flex gap-16 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">RAAGA</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="hover:text-foreground cursor-pointer">Songs</li>
                        <li className="hover:text-foreground cursor-pointer">Radio</li>
                        <li className="hover:text-foreground cursor-pointer">Podcast</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Access</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="hover:text-foreground cursor-pointer">Explore</li>
                        <li className="hover:text-foreground cursor-pointer">Artists</li>
                        <li className="hover:text-foreground cursor-pointer">Playlists</li>
                        <li className="hover:text-foreground cursor-pointer">Albums</li>
                        <li className="hover:text-foreground cursor-pointer">Trending</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Contact</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="hover:text-foreground cursor-pointer">About</li>
                        <li className="hover:text-foreground cursor-pointer">Policy</li>
                        <li className="hover:text-foreground cursor-pointer">Social Media</li>
                        <li className="hover:text-foreground cursor-pointer">Support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </footer>
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Albums;
