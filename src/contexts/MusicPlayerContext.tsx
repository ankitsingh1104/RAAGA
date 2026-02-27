import React, { createContext, useContext, useState, useCallback } from "react";
import { recordPlay } from "@/lib/listeningHistory";

export interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  duration?: number;
  album?: string;
  youtubeId?: string;
  source?: "youtube";
}

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  queue: Track[];
  youtubeVideoId: string | null;
  play: (track?: Track) => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  next: () => void;
  previous: () => void;
  addToQueue: (track: Track) => void;
  setQueue: (tracks: Track[]) => void;
  playTrack: (track: Track, playlist?: Track[]) => void;
  updateProgress: (currentTime: number, totalDuration: number) => void;
  handleYouTubeEnded: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueueState] = useState<Track[]>([]);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);

  const updateProgress = useCallback((currentTime: number, totalDuration: number) => {
    setProgress(currentTime);
    setDuration(totalDuration);
  }, []);

  const next = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    const nextTrack = queue[nextIndex];
    
    if (nextTrack) {
      setCurrentTrack(nextTrack);
      setYoutubeVideoId(nextTrack.youtubeId || null);
      setIsPlaying(true);
      setProgress(0);
    }
  }, [currentTrack, queue]);

  const handleYouTubeEnded = useCallback(() => {
    setIsPlaying(false);
    next();
  }, [next]);

  const playTrack = useCallback((track: Track, playlist?: Track[]) => {
    if (playlist) {
      setQueueState(playlist);
    }

    setCurrentTrack(track);
    setYoutubeVideoId(track.youtubeId || null);
    setIsPlaying(true);
    setProgress(0);

    // Record play for AI recommendations
    if (track.youtubeId) {
      recordPlay(track.youtubeId, track.title, track.artist);
    }
  }, []);

  const play = useCallback((track?: Track) => {
    if (track) {
      playTrack(track);
    } else if (currentTrack && youtubeVideoId) {
      setIsPlaying(true);
    }
  }, [currentTrack, youtubeVideoId, playTrack]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const seek = useCallback((time: number) => {
    setProgress(time);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
  }, []);

  const previous = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
    const prevTrack = queue[prevIndex];
    
    if (prevTrack) {
      setCurrentTrack(prevTrack);
      setYoutubeVideoId(prevTrack.youtubeId || null);
      setIsPlaying(true);
      setProgress(0);
    }
  }, [currentTrack, queue]);

  const addToQueue = useCallback((track: Track) => {
    setQueueState((prev) => [...prev, track]);
  }, []);

  const setQueue = useCallback((tracks: Track[]) => {
    setQueueState(tracks);
  }, []);

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        progress,
        duration,
        volume,
        queue,
        youtubeVideoId,
        play,
        pause,
        toggle,
        seek,
        setVolume,
        next,
        previous,
        addToQueue,
        setQueue,
        playTrack,
        updateProgress,
        handleYouTubeEnded,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
