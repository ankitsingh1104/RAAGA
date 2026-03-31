import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Track } from "@/contexts/MusicPlayerContext";

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: number;
}

interface UserDataContextType {
  favorites: Track[];
  playlists: Playlist[];
  toggleFavorite: (track: Track) => void;
  isFavorite: (trackId: number) => boolean;
  createPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: number) => void;
  deletePlaylist: (playlistId: string) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Track[]>(() => {
    try { return JSON.parse(localStorage.getItem("raaga_favorites") || "[]"); } catch { return []; }
  });
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try { return JSON.parse(localStorage.getItem("raaga_playlists") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("raaga_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("raaga_playlists", JSON.stringify(playlists));
  }, [playlists]);

  const toggleFavorite = useCallback((track: Track) => {
    setFavorites(prev => {
      const exists = prev.some(t => t.id === track.id);
      return exists ? prev.filter(t => t.id !== track.id) : [...prev, track];
    });
  }, []);

  const isFavorite = useCallback((trackId: number) => {
    return favorites.some(t => t.id === trackId);
  }, [favorites]);

  const createPlaylist = useCallback((name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: Date.now(),
    };
    setPlaylists(prev => [...prev, newPlaylist]);
  }, []);

  const addToPlaylist = useCallback((playlistId: string, track: Track) => {
    setPlaylists(prev => prev.map(p =>
      p.id === playlistId && !p.tracks.some(t => t.id === track.id)
        ? { ...p, tracks: [...p.tracks, track] }
        : p
    ));
  }, []);

  const removeFromPlaylist = useCallback((playlistId: string, trackId: number) => {
    setPlaylists(prev => prev.map(p =>
      p.id === playlistId
        ? { ...p, tracks: p.tracks.filter(t => t.id !== trackId) }
        : p
    ));
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  }, []);

  return (
    <UserDataContext.Provider value={{ favorites, playlists, toggleFavorite, isFavorite, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const ctx = useContext(UserDataContext);
  if (!ctx) throw new Error("useUserData must be used within UserDataProvider");
  return ctx;
}
