import { Plus, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

interface Song {
  id: number;
  title: string;
  artist: string;
  cover: string;
}

interface SongSectionProps {
  title: string;
  highlightedWord: string;
  songs: Song[];
}

export function SongSection({ title, highlightedWord, songs }: SongSectionProps) {
  const titleParts = title.split(highlightedWord);
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();

  const handlePlayClick = (song: Song, e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentTrack?.id === song.id) {
      toggle();
    } else {
      playTrack(song, songs);
    }
  };

  return (
    <section className="px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">
          {titleParts[0]}
          <span className="text-primary">{highlightedWord}</span>
          {titleParts[1] || ""}
        </h3>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          <Plus className="h-4 w-4 mr-2" />
          View All
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {songs.map((song) => {
          const isCurrentSong = currentTrack?.id === song.id;
          const isThisPlaying = isCurrentSong && isPlaying;

          return (
            <div
              key={song.id}
              className="group cursor-pointer"
              onClick={(e) => handlePlayClick(song, e)}
            >
              <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-black/40 ${isCurrentSong ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity flex items-center justify-center`}>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center hover:scale-110 transition-transform">
                    {isThisPlaying ? (
                      <Pause className="w-5 h-5 text-primary-foreground" fill="currentColor" />
                    ) : (
                      <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
                    )}
                  </div>
                </div>
              </div>
              <h4 className={`font-medium text-sm truncate ${isCurrentSong ? 'text-primary' : ''}`}>{song.title}</h4>
              <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
