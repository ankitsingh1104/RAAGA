import { Play, Pause, Loader2 } from "lucide-react";
import { Track, useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  results: Track[];
  isLoading: boolean;
  error: string | null;
  onClose?: () => void;
}

export function SearchResults({ results, isLoading, error, onClose }: SearchResultsProps) {
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();

  const handlePlayClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      toggle();
    } else {
      playTrack(track, results);
    }
    onClose?.();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Searching...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-destructive">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-4">
        Search <span className="text-primary">Results</span>
      </h3>
      <div className="grid gap-2 max-h-[400px] overflow-y-auto pr-2">
        {results.map((track) => {
          const isCurrentTrack = currentTrack?.id === track.id;
          const isThisPlaying = isCurrentTrack && isPlaying;
          const isYouTube = track.source === "youtube";

          return (
            <div
              key={track.id}
              onClick={() => handlePlayClick(track)}
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
        })}
      </div>
    </div>
  );
}
