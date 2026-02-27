import { useState, useEffect } from "react";
import { Track, useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { fetchYouTubeData } from "@/hooks/useYouTubeData";
import { buildRecommendationQuery, getTimeOfDay, getTopGenres } from "@/lib/listeningHistory";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, Sun, Cloud, Moon, Stars } from "lucide-react";

const timeIcons = { morning: Sun, afternoon: Cloud, evening: Moon, night: Stars };
const timeLabels = { morning: "Morning", afternoon: "Afternoon", evening: "Evening", night: "Night" };

export function RecommendedSection() {
  const { playTrack } = useMusicPlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const time = getTimeOfDay();
  const topGenres = getTopGenres(2);
  const TimeIcon = timeIcons[time];

  useEffect(() => {
    const controller = new AbortController();
    const query = buildRecommendationQuery();

    fetchYouTubeData(query, 10, controller.signal)
      .then((data) => {
        const english = data.filter((t) => {
          const pattern = /[\u0900-\u097F]|[\u0980-\u09FF]|[\u0A00-\u0A7F]|[\u0B00-\u0B7F]/;
          return !pattern.test(t.title) && !pattern.test(t.artist);
        });
        setTracks(english);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Recommendation fetch error:", err);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const handlePlay = (track: Track) => playTrack(track, tracks);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Recommended For You</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TimeIcon className="h-4 w-4" />
          <span>{timeLabels[time]}</span>
          {topGenres.length > 0 && (
            <>
              <span className="mx-1">·</span>
              {topGenres.map((g) => (
                <span key={g} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs capitalize">
                  {g}
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[160px] flex-shrink-0">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Skeleton className="h-3 w-1/2 mt-1" />
                </div>
              ))
            : tracks.map((track) => (
                <div
                  key={track.id}
                  className="w-[160px] flex-shrink-0 cursor-pointer group"
                  onClick={() => handlePlay(track)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden relative">
                    <img
                      src={track.cover}
                      alt={track.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-primary-foreground ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-foreground truncate">{track.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                </div>
              ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
