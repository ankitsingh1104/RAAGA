import { Play, Pause } from "lucide-react";
import { Track, useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResultsProps {
  results: Track[];
  isLoading: boolean;
  error: string | null;
  onClose?: () => void;
}

function TrackSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/40">
      <Skeleton className="w-12 h-12 rounded-md flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

function TrackItem({ 
  track, 
  allTracks,
  onClose 
}: { 
  track: Track; 
  allTracks: Track[];
  onClose?: () => void;
}) {
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();
  const isCurrentTrack = currentTrack?.id === track.id;
  const isThisPlaying = isCurrentTrack && isPlaying;

  const handlePlayClick = () => {
    if (isCurrentTrack) {
      toggle();
    } else {
      playTrack(track, allTracks);
    }
    onClose?.();
  };

  return (
    <div
      onClick={handlePlayClick}
      className={cn(
        "flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all",
        "hover:bg-secondary/80",
        isCurrentTrack ? "bg-primary/10 border border-primary/30" : "bg-secondary/40"
      )}
    >
      <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
        <img
          src={track.cover}
          alt={track.title}
          className="w-full h-full object-cover"
        />
        <div
          className={cn(
            "absolute inset-0 bg-black/50 flex items-center justify-center",
            isCurrentTrack ? "opacity-100" : "opacity-0 hover:opacity-100",
            "transition-opacity"
          )}
        >
          {isThisPlaying ? (
            <Pause className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          ) : (
            <Play className="h-5 w-5 text-primary-foreground ml-0.5" fill="currentColor" />
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={cn("font-medium text-sm truncate", isCurrentTrack && "text-primary")}>
          {track.title}
        </h4>
        <p className="text-xs text-muted-foreground truncate">
          {track.artist}
        </p>
      </div>
    </div>
  );
}

export function SearchResults({ 
  results, 
  isLoading, 
  error, 
  onClose 
}: SearchResultsProps) {
  if (error) {
    return (
      <div className="py-8 text-center text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!results.length && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
      {isLoading ? (
        <>
          <TrackSkeleton />
          <TrackSkeleton />
          <TrackSkeleton />
          <TrackSkeleton />
          <TrackSkeleton />
        </>
      ) : (
        results.map((track) => (
          <TrackItem 
            key={track.id} 
            track={track} 
            allTracks={results}
            onClose={onClose} 
          />
        ))
      )}
    </div>
  );
}
