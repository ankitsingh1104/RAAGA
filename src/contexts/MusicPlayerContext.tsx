import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

export interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  previewUrl?: string;
  duration?: number;
}

interface MusicPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  queue: Track[];
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
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueueState] = useState<Track[]>([]);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      next();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, []);

  const fetchDeezerPreview = async (title: string, artist: string): Promise<string | null> => {
    try {
      const query = encodeURIComponent(`${title} ${artist}`);
      const response = await fetch(
        `https://corsproxy.io/?${encodeURIComponent(`https://api.deezer.com/search?q=${query}&limit=1`)}`
      );
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        return data.data[0].preview;
      }
      return null;
    } catch (error) {
      console.error("Error fetching Deezer preview:", error);
      return null;
    }
  };

  const playTrack = useCallback(async (track: Track, playlist?: Track[]) => {
    if (!audioRef.current) return;

    // Set queue if provided
    if (playlist) {
      setQueueState(playlist);
    }

    // Fetch preview URL if not present
    let previewUrl = track.previewUrl;
    if (!previewUrl) {
      previewUrl = await fetchDeezerPreview(track.title, track.artist);
    }

    if (!previewUrl) {
      console.error("No preview available for this track");
      return;
    }

    const trackWithPreview = { ...track, previewUrl };
    setCurrentTrack(trackWithPreview);
    audioRef.current.src = previewUrl;
    audioRef.current.play();
    setIsPlaying(true);
  }, []);

  const play = useCallback((track?: Track) => {
    if (!audioRef.current) return;
    
    if (track) {
      playTrack(track);
    } else if (currentTrack?.previewUrl) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentTrack, playTrack]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
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
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = newVolume;
    setVolumeState(newVolume);
  }, []);

  const next = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % queue.length;
    playTrack(queue[nextIndex]);
  }, [currentTrack, queue, playTrack]);

  const previous = useCallback(() => {
    if (!currentTrack || queue.length === 0) return;
    
    const currentIndex = queue.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = currentIndex <= 0 ? queue.length - 1 : currentIndex - 1;
    playTrack(queue[prevIndex]);
  }, [currentTrack, queue, playTrack]);

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
