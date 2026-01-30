import { Play, Pause } from "lucide-react";
import { Track, useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchResultsProps {
  jamendoResults: Track[];
  youtubeResults: Track[];
  jamendoLoading: boolean;
  youtubeLoading: boolean;
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
      <Skeleton className="h-5 w-16 rounded" />
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
  const isYouTube = track.source === "youtube";

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

      <span className={cn(
        "text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0",
        isYouTube 
          ? "bg-red-500/20 text-red-400" 
          : "bg-primary/20 text-primary"
      )}>
        {isYouTube ? "YouTube" : "Jamendo"}
      </span>

      {track.duration && !isYouTube && (
        <span className="text-xs text-muted-foreground w-12 text-right">
          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

export function SearchResults({ 
  jamendoResults, 
  youtubeResults, 
  jamendoLoading, 
  youtubeLoading, 
  error, 
  onClose 
}: SearchResultsProps) {
  const allTracks = [...jamendoResults, ...youtubeResults];
  const hasResults = jamendoResults.length > 0 || youtubeResults.length > 0;
  const isLoading = jamendoLoading || youtubeLoading;

  if (error) {
    return (
      <div className="py-8 text-center text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!hasResults && !isLoading) {
    return null;
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
      {/* Jamendo Section */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <span className="text-primary">Jamendo</span>
          {jamendoLoading && <span className="text-xs text-muted-foreground">(loading...)</span>}
        </h3>
        <div className="grid gap-2">
          {jamendoLoading ? (
            <>
              <TrackSkeleton />
              <TrackSkeleton />
              <TrackSkeleton />
            </>
          ) : jamendoResults.length > 0 ? (
            jamendoResults.map((track) => (
              <TrackItem 
                key={track.id} 
                track={track} 
                allTracks={allTracks}
                onClose={onClose} 
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground py-2">No Jamendo results</p>
          )}
        </div>
      </div>

      {/* YouTube Section */}
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <span className="text-red-400">YouTube</span>
          {youtubeLoading && <span className="text-xs text-muted-foreground">(loading...)</span>}
        </h3>
        <div className="grid gap-2">
          {youtubeLoading ? (
            <>
              <TrackSkeleton />
              <TrackSkeleton />
              <TrackSkeleton />
            </>
          ) : youtubeResults.length > 0 ? (
            youtubeResults.map((track) => (
              <TrackItem 
                key={track.id} 
                track={track} 
                allTracks={allTracks}
                onClose={onClose} 
              />
            ))
          ) : (
            <p className="text-xs text-muted-foreground py-2">No YouTube results</p>
          )}
        </div>
      </div>
    </div>
  );
}
