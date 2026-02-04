import { Heart, Play, Pause } from "lucide-react";
import { Track, useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface RecentlyPlayedTableProps {
  tracks: Track[];
  isLoading?: boolean;
}

export function RecentlyPlayedTable({ tracks, isLoading }: RecentlyPlayedTableProps) {
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();

  const handlePlay = (track: Track) => {
    if (currentTrack?.id === track.id) {
      toggle();
    } else {
      playTrack(track, tracks);
    }
  };

  // Generate a random duration for display
  const getRandomDuration = () => {
    const minutes = Math.floor(Math.random() * 3) + 3;
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Recently Played</h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-2">
              <Skeleton className="w-8 h-4" />
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-foreground mb-4">Recently Played</h2>
      
      {/* Table header */}
      <div className="grid grid-cols-[40px_1fr_80px_80px] gap-4 px-2 py-2 text-sm text-muted-foreground border-b border-border/30">
        <span># Song</span>
        <span></span>
        <span># Duration</span>
        <span></span>
      </div>
      
      {/* Table rows */}
      <div className="space-y-1 mt-2">
        {tracks.slice(0, 8).map((track, index) => {
          const isCurrentSong = currentTrack?.id === track.id;
          const isThisPlaying = isCurrentSong && isPlaying;
          
          return (
            <div
              key={track.id}
              className={`grid grid-cols-[40px_1fr_80px_80px] gap-4 items-center p-2 rounded-lg hover:bg-secondary/30 transition-colors group cursor-pointer ${
                isCurrentSong ? "bg-secondary/40" : ""
              }`}
              onClick={() => handlePlay(track)}
            >
              {/* Song number/thumbnail */}
              <div className="relative">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              </div>
              
              {/* Song info */}
              <div className="min-w-0">
                <h4 className={`font-medium text-sm truncate ${isCurrentSong ? "text-primary" : "text-foreground"}`}>
                  {track.title}
                </h4>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>
              
              {/* Duration */}
              <span className="text-sm text-muted-foreground">
                {getRandomDuration()}
              </span>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="h-5 w-5" />
                </button>
                <Button
                  size="icon"
                  className="w-8 h-8 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlay(track);
                  }}
                >
                  {isThisPlaying ? (
                    <Pause className="h-4 w-4" fill="currentColor" />
                  ) : (
                    <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
