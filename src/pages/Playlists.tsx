import { ListMusic, Play, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useUserData } from "@/contexts/UserDataContext";
import { Button } from "@/components/ui/button";

const Playlists = () => {
  const { playTrack, currentTrack, toggle } = useMusicPlayer();
  const { playlists, deletePlaylist } = useUserData();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">
        <ListMusic className="inline-block mr-2 h-6 w-6 text-primary" />
        Your <span className="text-primary">Playlists</span>
      </h1>
      {playlists.length === 0 ? (
        <p className="text-muted-foreground">No playlists yet. Create one from the sidebar!</p>
      ) : (
        <div className="space-y-4">
          {playlists.map(playlist => (
            <div key={playlist.id} className="bg-card rounded-lg border border-border/50 overflow-hidden">
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                onClick={() => setExpandedId(expandedId === playlist.id ? null : playlist.id)}
              >
                <div>
                  <h3 className="font-semibold">{playlist.name}</h3>
                  <p className="text-xs text-muted-foreground">{playlist.tracks.length} songs</p>
                </div>
                <div className="flex items-center gap-2">
                  {playlist.tracks.length > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => { e.stopPropagation(); playTrack(playlist.tracks[0], playlist.tracks); }}
                    >
                      <Play className="h-4 w-4" fill="currentColor" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={(e) => { e.stopPropagation(); deletePlaylist(playlist.id); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {expandedId === playlist.id && playlist.tracks.length > 0 && (
                <div className="border-t border-border/50 p-2">
                  {playlist.tracks.map((track, i) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-secondary/30 cursor-pointer"
                      onClick={() => playTrack(track, playlist.tracks)}
                    >
                      <span className="text-xs text-muted-foreground w-5">{i + 1}</span>
                      <img src={track.cover} alt={track.title} className="w-8 h-8 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;
