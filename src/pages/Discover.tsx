import { useState, useEffect } from "react";
import { ArrowLeft, Heart, MoreHorizontal, Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useMusicPlayer, Track } from "@/contexts/MusicPlayerContext";
import { fetchYouTubeData } from "@/hooks/useYouTubeData";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

interface TrendingSong extends Omit<Track, 'duration'> {
  rank: number;
  releaseDate: string;
  album: string;
  durationText: string;
  liked: boolean;
}

const Discover = () => {
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();
  
  const [trendingSongs, setTrendingSongs] = useState<TrendingSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetchYouTubeData("trending music songs 2024", 20, controller.signal)
      .then((tracks) => {
        const songsWithMeta: TrendingSong[] = tracks.map((track, index) => ({
          ...track,
          rank: index + 1,
          releaseDate: getRandomDate(),
          album: track.title,
          durationText: getRandomDuration(),
          liked: index === 0,
        }));
        setTrendingSongs(songsWithMeta);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch trending songs:", err);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const playlist = trendingSongs.map((s) => ({
    id: s.id,
    title: s.title,
    artist: s.artist,
    cover: s.cover,
    youtubeId: s.youtubeId,
    source: s.source,
  }));

  const handlePlayAll = () => {
    if (playlist.length > 0) {
      playTrack(playlist[0], playlist);
    }
  };

  const handleRowClick = (song: TrendingSong) => {
    if (currentTrack?.id === song.id) {
      toggle();
    } else {
      playTrack(
        { 
          id: song.id, 
          title: song.title, 
          artist: song.artist, 
          cover: song.cover,
          youtubeId: song.youtubeId,
          source: song.source,
        },
        playlist
      );
    }
  };

  const heroImage = trendingSongs[0]?.cover || "/placeholder.svg";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <DashboardHeader />
          <div className="flex-1 bg-gradient-to-b from-secondary via-background to-background pb-24">
            {/* Hero Section */}
            <div className="px-6 py-8 flex items-start gap-6">
              <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-2xl flex-shrink-0">
                {isLoading ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <>
                    <img
                      src={heroImage}
                      alt="Trending Music"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider">TRENDING</p>
                      <p className="text-lg font-bold text-foreground">MUSIC</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">
                  Trending songs <span className="text-primary">mix</span>
                </h1>
                <p className="text-muted-foreground text-sm mb-4">
                  {isLoading 
                    ? "Loading trending songs..."
                    : trendingSongs.slice(0, 3).map(s => s.artist).join(", ") + " and ..."}
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm text-muted-foreground">{trendingSongs.length} songs</span>
                  <span className="text-primary">•</span>
                  <span className="text-sm text-muted-foreground">~1h 30m</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-medium">Play All</span>
                  <Button
                    size="icon"
                    className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={handlePlayAll}
                    disabled={isLoading}
                  >
                    <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Songs Table */}
            <div className="px-6">
              <div className="grid grid-cols-[40px_1fr_150px_1fr_80px_40px] gap-4 py-3 text-sm text-muted-foreground border-b border-border/30">
                <span></span>
                <span></span>
                <span>Release Date</span>
                <span>Album</span>
                <span className="text-right">Time</span>
                <span></span>
              </div>

              <ScrollArea className="h-[calc(100vh-420px)]">
                <div className="divide-y divide-border/20">
                  {isLoading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[40px_1fr_150px_1fr_80px_40px] gap-4 py-3 items-center"
                        >
                          <Skeleton className="w-6 h-6 rounded" />
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-1" />
                              <Skeleton className="h-3 w-20" />
                            </div>
                          </div>
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-10 ml-auto" />
                          <Skeleton className="h-6 w-6 rounded" />
                        </div>
                      ))
                    : trendingSongs.map((song) => {
                        const isCurrentSong = currentTrack?.id === song.id;
                        const isThisPlaying = isCurrentSong && isPlaying;

                        return (
                          <div
                            key={song.id}
                            className={`grid grid-cols-[40px_1fr_150px_1fr_80px_40px] gap-4 py-3 items-center hover:bg-secondary/20 transition-colors group cursor-pointer ${isCurrentSong ? 'bg-secondary/30' : ''}`}
                            onClick={() => handleRowClick(song)}
                          >
                            <div className="relative w-6 h-6 flex items-center justify-center">
                              <span className={`text-primary font-bold ${isCurrentSong ? 'opacity-0' : 'group-hover:opacity-0'}`}>
                                {song.rank}
                              </span>
                              <div className={`absolute inset-0 flex items-center justify-center ${isCurrentSong ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                {isThisPlaying ? (
                                  <Pause className="h-4 w-4 text-primary" fill="currentColor" />
                                ) : (
                                  <Play className="h-4 w-4 text-primary" fill="currentColor" />
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <img
                                src={song.cover}
                                alt={song.title}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <h4 className={`font-medium text-sm ${isCurrentSong ? 'text-primary' : 'text-foreground'}`}>{song.title}</h4>
                                <p className="text-xs text-muted-foreground">{song.artist}</p>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">{song.releaseDate}</span>
                            <span className="text-sm text-muted-foreground truncate">{song.album}</span>
                            <div className="flex items-center justify-end gap-2">
                              <Heart
                                className={`h-4 w-4 ${song.liked ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"} transition-colors cursor-pointer`}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span className="text-sm text-muted-foreground">{song.durationText}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        );
                      })}
                </div>
              </ScrollArea>
            </div>

            {/* Footer */}
            <div className="absolute bottom-24 right-6 flex flex-col items-end gap-4">
              <h2 className="text-2xl font-bold text-foreground/80 tracking-wider">Raaga</h2>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="cursor-pointer hover:text-foreground transition-colors">📱</span>
                <span className="cursor-pointer hover:text-foreground transition-colors">📷</span>
                <span className="cursor-pointer hover:text-foreground transition-colors">🐦</span>
                <span className="cursor-pointer hover:text-foreground transition-colors">📞</span>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

// Helper functions
function getRandomDate(): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const year = Math.random() > 0.5 ? 2024 : 2023;
  const month = months[Math.floor(Math.random() * 12)];
  const day = Math.floor(Math.random() * 28) + 1;
  return `${month} ${day}, ${year}`;
}

function getRandomDuration(): string {
  const minutes = Math.floor(Math.random() * 4) + 2;
  const seconds = Math.floor(Math.random() * 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default Discover;
