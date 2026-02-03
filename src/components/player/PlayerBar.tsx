import { useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from "lucide-react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { YouTubePlayer, YouTubePlayerHandle } from "./YouTubePlayer";

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    progress,
    duration,
    volume,
    toggle,
    seek,
    setVolume,
    next,
    previous,
    youtubeVideoId,
    updateProgress,
    handleYouTubeEnded,
  } = useMusicPlayer();

  const youtubeRef = useRef<YouTubePlayerHandle>(null);

  const handleSeek = (value: number) => {
    if (youtubeRef.current) {
      youtubeRef.current.seekTo(value);
    }
    seek(value);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      {/* Hidden YouTube Player */}
      {youtubeVideoId && (
        <YouTubePlayer
          ref={youtubeRef}
          videoId={youtubeVideoId}
          isPlaying={isPlaying}
          volume={volume}
          onTimeUpdate={updateProgress}
          onEnded={handleYouTubeEnded}
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 h-20 bg-card/95 backdrop-blur-lg border-t border-border z-50">
        <div className="flex items-center justify-between h-full px-4 max-w-screen-2xl mx-auto">
          {/* Track Info */}
          <div className="flex items-center gap-3 w-[30%] min-w-0">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-14 h-14 rounded-md object-cover shadow-lg"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-sm truncate text-foreground">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-col items-center gap-1 w-[40%]">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground hover:text-primary"
                onClick={previous}
              >
                <SkipBack className="h-5 w-5" fill="currentColor" />
              </Button>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={toggle}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" fill="currentColor" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-foreground hover:text-primary"
                onClick={next}
              >
                <SkipForward className="h-5 w-5" fill="currentColor" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Repeat className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full max-w-md">
              <span className="text-xs text-muted-foreground w-10 text-right">
                {formatTime(progress)}
              </span>
              <Slider
                value={[progress]}
                max={duration || 100}
                step={0.1}
                onValueChange={([value]) => handleSeek(value)}
                className="flex-1 cursor-pointer"
              />
              <span className="text-xs text-muted-foreground w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Volume Controls */}
          <div className="flex items-center justify-end gap-2 w-[30%]">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            >
              {volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={([value]) => setVolume(value / 100)}
              className="w-24 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </>
  );
}
