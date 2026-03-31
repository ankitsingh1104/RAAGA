import { useMemo } from "react";
import { Play, Clock } from "lucide-react";
import { getHistory } from "@/lib/listeningHistory";
import { useMusicPlayer, Track } from "@/contexts/MusicPlayerContext";

const RecentlyAdded = () => {
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();

  const recentTracks = useMemo(() => {
    const history = getHistory();
    const seen = new Set<string>();
    const unique: Track[] = [];
    for (const entry of history) {
      if (!seen.has(entry.videoId)) {
        seen.add(entry.videoId);
        unique.push({
          id: Math.abs(entry.videoId.split("").reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)),
          title: entry.title,
          artist: entry.artist,
          cover: `https://img.youtube.com/vi/${entry.videoId}/hqdefault.jpg`,
          youtubeId: entry.videoId,
          source: "youtube",
        });
      }
      if (unique.length >= 20) break;
    }
    return unique;
  }, []);

  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold mb-6">
        <Clock className="inline-block mr-2 h-6 w-6 text-primary" />
        Recently <span className="text-primary">Played</span>
      </h1>
      {recentTracks.length === 0 ? (
        <p className="text-muted-foreground">No listening history yet. Start playing some songs!</p>
      ) : (
        <div className="space-y-2">
          {recentTracks.map((track, i) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <div
                key={`${track.id}-${i}`}
                onClick={() => isCurrent ? toggle() : playTrack(track, recentTracks)}
                className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors hover:bg-secondary/50 ${isCurrent ? "bg-secondary/30" : ""}`}
              >
                <span className="text-sm text-muted-foreground w-6 text-center">{i + 1}</span>
                <img src={track.cover} alt={track.title} className="w-12 h-12 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm truncate ${isCurrent ? "text-primary" : ""}`}>{track.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
                <Play className="h-4 w-4 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentlyAdded;
