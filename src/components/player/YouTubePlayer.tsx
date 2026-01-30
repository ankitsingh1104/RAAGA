import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";

interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface YTPlayerOptions {
  height: string;
  width: string;
  videoId: string;
  playerVars: {
    autoplay: number;
    controls: number;
    disablekb: number;
    fs: number;
    modestbranding: number;
    rel: number;
  };
  events: {
    onReady: (event: YTPlayerEvent) => void;
    onStateChange: (event: YTPlayerEvent) => void;
  };
}

interface YTNamespace {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
  };
}

declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string | null;
  isPlaying: boolean;
  volume: number;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onReady?: () => void;
}

export interface YouTubePlayerHandle {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
}

export const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  ({ videoId, isPlaying, volume, onTimeUpdate, onEnded, onReady }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<YTPlayer | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        playerRef.current?.seekTo(seconds, true);
      },
      getCurrentTime: () => {
        return playerRef.current?.getCurrentTime() || 0;
      },
      getDuration: () => {
        return playerRef.current?.getDuration() || 0;
      },
    }));

    // Load YouTube IFrame API
    useEffect(() => {
      if (window.YT) return;

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }, []);

    // Initialize player when videoId changes
    useEffect(() => {
      if (!videoId) return;

      const initPlayer = () => {
        if (!containerRef.current) return;

        // Destroy existing player
        if (playerRef.current) {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player(containerRef.current, {
          height: "0",
          width: "0",
          videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
          },
          events: {
            onReady: (event) => {
              event.target.setVolume(volume * 100);
              if (isPlaying) {
                event.target.playVideo();
              }
              onReady?.();

              // Start time update interval
              intervalRef.current = setInterval(() => {
                if (playerRef.current) {
                  const currentTime = playerRef.current.getCurrentTime();
                  const duration = playerRef.current.getDuration();
                  onTimeUpdate?.(currentTime, duration);
                }
              }, 250);
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                onEnded?.();
              }
            },
          },
        });
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        window.onYouTubeIframeAPIReady = initPlayer;
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, [videoId]);

    // Handle play/pause
    useEffect(() => {
      if (!playerRef.current) return;

      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }, [isPlaying]);

    // Handle volume
    useEffect(() => {
      if (!playerRef.current) return;
      playerRef.current.setVolume(volume * 100);
    }, [volume]);

    return <div ref={containerRef} className="hidden" />;
  }
);

YouTubePlayer.displayName = "YouTubePlayer";
