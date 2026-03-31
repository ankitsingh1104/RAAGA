import { Heart, Play, Trash2 } from "lucide-react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { useUserData } from "@/contexts/UserDataContext";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();
  const { favorites, toggleFavorite } = useUserData();

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">
        <Heart className="inline-block mr-2 h-6 w-6 text-primary" fill="currentColor" />
        Your <span className="text-primary">Favorites</span>
      </h1>
      {favorites.length === 0 ? (
        <p className="text-muted-foreground">No favorites yet. Click the heart icon on any song to add it here!</p>
      ) : (
        <div className="space-y-2">
          {favorites.map((track, i) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:bg-secondary/50 ${isCurrent ? "bg-secondary/30" : ""}`}
                onClick={() => isCurrent ? toggle() : playTrack(track, favorites)}
              >
                <span className="text-sm text-muted-foreground w-6 text-center">{i + 1}</span>
                <img src={track.cover} alt={track.title} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm truncate ${isCurrent ? "text-primary" : ""}`}>{track.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary hover:text-destructive"
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Favorites;
