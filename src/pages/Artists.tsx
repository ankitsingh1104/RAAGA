import { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchYouTubeData } from "@/hooks/useYouTubeData";
import { useMusicPlayer, Track } from "@/contexts/MusicPlayerContext";

const artistQueries = [
  "Ed Sheeran top songs", "Taylor Swift hits", "The Weeknd popular songs",
  "Dua Lipa best songs", "Drake top tracks", "Billie Eilish hits",
  "Post Malone songs", "Ariana Grande popular", "Bruno Mars hits",
  "Imagine Dragons top songs", "Adele best songs", "Eminem hits",
];

const Artists = () => {
  const [artists, setArtists] = useState<{ name: string; tracks: Track[]; image: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();

  useEffect(() => {
    const controller = new AbortController();
    Promise.all(
      artistQueries.map(q =>
        fetchYouTubeData(q, 3, controller.signal)
          .then(tracks => ({
            name: q.replace(/ (top songs|hits|popular songs|best songs|popular|top tracks|songs)$/i, ""),
            tracks,
            image: tracks[0]?.cover || "/placeholder.svg",
          }))
          .catch(() => ({ name: q, tracks: [] as Track[], image: "/placeholder.svg" }))
      )
    ).then(results => {
      setArtists(results.filter(a => a.tracks.length > 0));
      setIsLoading(false);
    });
    return () => controller.abort();
  }, []);

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">
        Popular <span className="text-primary">Artists</span>
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <Skeleton className="w-32 h-32 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))
          : artists.map((artist) => (
              <div
                key={artist.name}
                className="flex flex-col items-center gap-3 group cursor-pointer"
                onClick={() => {
                  if (artist.tracks[0]) playTrack(artist.tracks[0], artist.tracks);
                }}
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <Play className="w-4 h-4 text-primary-foreground ml-0.5" fill="currentColor" />
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-sm text-center">{artist.name}</h3>
                <p className="text-xs text-muted-foreground">{artist.tracks.length} songs</p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Artists;
