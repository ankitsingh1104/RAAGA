import { useMemo } from "react";
import { Star, Play } from "lucide-react";
import { getHistory } from "@/lib/listeningHistory";
import { useMusicPlayer, Track } from "@/contexts/MusicPlayerContext";

const MostPlayed = () => {
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();

  const topTracks = useMemo(() => {
    const history = getHistory();
    const freq: Record<string, { count: number; entry: typeof history[0] }> = {};
    for (const e of history) {
      if (!freq[e.videoId]) freq[e.videoId] = { count: 0, entry: e };
      freq[e.videoId].count++;
    }
    return Object.values(freq)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)
      .map(({ count, entry }) => ({
        track: {
          id: Math.abs(entry.videoId.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
          title: entry.title,
          artist: entry.artist,
          cover: `https://img.youtube.com/vi/${entry.videoId}/hqdefault.jpg`,
          youtubeId: entry.videoId,
          source: "youtube" as const,
        },
        count,
      }));
  }, []);

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">
        <Star className="inline-block mr-2 h-6 w-6 text-primary" />
        Most <span className="text-primary">Played</span>
      </h1>
      {topTracks.length === 0 ? (
        <p className="text-muted-foreground">No play history yet. Start listening to build your stats!</p>
      ) : (
        <div className="space-y-2">
          {topTracks.map(({ track, count }, i) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={track.id}
                onClick={() => isCurrent ? toggle() : playTrack(track, topTracks.map(t => t.track))}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:bg-secondary/50 ${isCurrent ? "bg-secondary/30" : ""}`}
              >
                <span className="text-sm font-bold text-primary w-6 text-center">{i + 1}</span>
                <img src={track.cover} alt={track.title} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm truncate ${isCurrent ? "text-primary" : ""}`}>{track.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground">{count} plays</span>
                <Play className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MostPlayed;
