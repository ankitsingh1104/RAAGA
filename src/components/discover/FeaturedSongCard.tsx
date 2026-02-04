import { Play, SkipForward, Volume2, Repeat, MoreHorizontal } from "lucide-react";
import { Track, useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedSongCardProps {
  track: Track | null;
  isLoading?: boolean;
  playlist?: Track[];
}

export function FeaturedSongCard({ track, isLoading, playlist = [] }: FeaturedSongCardProps) {
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();

  const handlePlay = () => {
    if (!track) return;
    
    if (currentTrack?.id === track.id) {
      toggle();
    } else {
      playTrack(track, playlist.length > 0 ? playlist : [track]);
    }
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-[180px] rounded-xl overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (!track) return null;

  const isCurrentlyPlaying = currentTrack?.id === track.id && isPlaying;

  return (
    <div 
      className="relative w-full h-[180px] rounded-xl overflow-hidden cursor-pointer group"
      onClick={handlePlay}
    >
      {/* Background image */}
      <img
        src={track.cover}
        alt={track.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      
      {/* More options button */}
      <button 
        className="absolute top-3 right-3 p-1 rounded-full bg-black/40 text-foreground/80 hover:bg-black/60 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="text-lg font-bold text-foreground truncate">{track.title}</h4>
        <p className="text-sm text-muted-foreground">{track.artist}</p>
        
        {/* Mini player controls */}
        <div className="mt-3 flex items-center gap-3">
          {/* Progress indicator */}
          <div className="flex-1 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">1:45</span>
            <div className="flex-1 h-1 bg-muted/40 rounded-full">
              <div className="w-1/3 h-full bg-primary rounded-full" />
            </div>
            <span className="text-xs text-muted-foreground">3:01</span>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-center gap-4">
          <button className="text-foreground/70 hover:text-foreground transition-colors">
            <Volume2 className="h-4 w-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center hover:scale-105 transition-transform">
            <Play className="h-4 w-4 text-background ml-0.5" fill="currentColor" />
          </button>
          <button className="text-foreground/70 hover:text-foreground transition-colors">
            <SkipForward className="h-4 w-4" />
          </button>
          <button className="text-foreground/70 hover:text-foreground transition-colors">
            <Repeat className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  );
}
