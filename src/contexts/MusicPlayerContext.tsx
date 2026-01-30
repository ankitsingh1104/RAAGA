import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";

// Jamendo API configuration
const JAMENDO_CLIENT_ID = "d4a4b8f5";
const JAMENDO_API_BASE = "https://api.jamendo.com/v3.0";

export interface Track {
  id: number;
  title: string;
  artist: string;
  cover: string;
  audioUrl?: string;
  duration?: number;
  album?: string;
  youtubeId?: string;
  source?: "jamendo" | "youtube";
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
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [queue, setQueueState] = useState<Track[]>([]);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);

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

  const updateProgress = useCallback((currentTime: number, totalDuration: number) => {
    setProgress(currentTime);
    setDuration(totalDuration);
  }, []);

  const handleYouTubeEnded = useCallback(() => {
    setIsPlaying(false);
    next();
  }, []);

  const fetchJamendoTrack = async (title: string, artist: string): Promise<{ audioUrl: string; cover: string } | null> => {
    try {
      const query = encodeURIComponent(`${title} ${artist}`);
      const response = await fetch(
        `${JAMENDO_API_BASE}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=1&search=${query}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return {
          audioUrl: data.results[0].audio,
          cover: data.results[0].album_image || data.results[0].image,
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching Jamendo track:", error);
      return null;
    }
  };

  const playTrack = useCallback(async (track: Track, playlist?: Track[]) => {
    // Set queue if provided
    if (playlist) {
      setQueueState(playlist);
    }

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Reset YouTube
    setYoutubeVideoId(null);

    // Handle YouTube track
    if (track.youtubeId || track.source === "youtube") {
      setCurrentTrack(track);
      setYoutubeVideoId(track.youtubeId || null);
      setIsPlaying(true);
      setProgress(0);
      return;
    }

    // Handle Jamendo track
    let audioUrl = track.audioUrl;
    let cover = track.cover;
    
    if (!audioUrl) {
      const jamendoData = await fetchJamendoTrack(track.title, track.artist);
      if (jamendoData) {
        audioUrl = jamendoData.audioUrl;
        cover = jamendoData.cover || track.cover;
      }
    }

    if (!audioUrl) {
      console.error("No audio available for this track");
      return;
    }

    const trackWithAudio = { ...track, audioUrl, cover, source: "jamendo" as const };
    setCurrentTrack(trackWithAudio);
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
    setIsPlaying(true);
  }, []);

  const play = useCallback((track?: Track) => {
    if (track) {
      playTrack(track);
    } else if (currentTrack) {
      if (currentTrack.source === "youtube" && youtubeVideoId) {
        setIsPlaying(true);
      } else if (audioRef.current && currentTrack.audioUrl) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [currentTrack, youtubeVideoId, playTrack]);

  const pause = useCallback(() => {
    if (currentTrack?.source === "youtube") {
      setIsPlaying(false);
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [currentTrack]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const seek = useCallback((time: number) => {
    if (currentTrack?.source === "youtube") {
      // YouTube seeking is handled by the YouTubePlayer component via ref
      setProgress(time);
    } else if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, [currentTrack]);

  const setVolume = useCallback((newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
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
