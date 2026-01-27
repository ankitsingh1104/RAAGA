import { Heart } from "lucide-react";

interface TrendingSong {
  id: number;
  rank: number;
  title: string;
  artist: string;
  cover: string;
  releaseDate: string;
  album: string;
  duration: string;
  liked?: boolean;
}

interface TrendingSongsProps {
  songs: TrendingSong[];
}

export function TrendingSongs({ songs }: TrendingSongsProps) {
  return (
    <section className="px-6 py-8">
      <h3 className="text-2xl font-bold mb-6">
        Trending <span className="text-primary">Songs</span>
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-muted-foreground border-b border-border/50">
              <th className="text-left py-3 px-2 font-medium w-12">#</th>
              <th className="text-left py-3 px-2 font-medium">Song</th>
              <th className="text-left py-3 px-2 font-medium hidden md:table-cell">Release Date</th>
              <th className="text-left py-3 px-2 font-medium hidden lg:table-cell">Album</th>
              <th className="text-right py-3 px-2 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song) => (
              <tr
                key={song.id}
                className="group hover:bg-secondary/30 transition-colors border-b border-border/20"
              >
                <td className="py-3 px-2">
                  <span className="text-primary font-bold">#{song.rank}</span>
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-sm">{song.title}</h4>
                      <p className="text-xs text-muted-foreground">{song.artist}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-2 text-sm text-muted-foreground hidden md:table-cell">
                  {song.releaseDate}
                </td>
                <td className="py-3 px-2 text-sm text-muted-foreground hidden lg:table-cell">
                  {song.album}
                </td>
                <td className="py-3 px-2">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Heart className={`h-4 w-4 ${song.liked ? "fill-primary text-primary" : ""}`} />
                    </button>
                    <span className="text-sm text-muted-foreground">{song.duration}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
