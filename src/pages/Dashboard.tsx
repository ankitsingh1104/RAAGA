import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { SongSection } from "@/components/dashboard/SongSection";
import { TrendingSongs } from "@/components/dashboard/TrendingSongs";
import { useState, useEffect } from "react";
import { fetchYouTubeData } from "@/hooks/useYouTubeData";
import { Track } from "@/contexts/MusicPlayerContext";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const [weeklyTop, setWeeklyTop] = useState<Track[]>([]);
  const [newRelease, setNewRelease] = useState<Track[]>([]);
  const [trending, setTrending] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      fetchYouTubeData("top english pop songs 2024", 5, controller.signal),
      fetchYouTubeData("new release english songs 2024", 5, controller.signal),
      fetchYouTubeData("trending english music 2024 billboard", 7, controller.signal),
    ])
      .then(([weekly, release, trend]) => {
        setWeeklyTop(weekly);
        setNewRelease(release);
        setTrending(trend);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Dashboard fetch error:", err);
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <main className="pb-8">
        <HeroBanner />
        <section className="px-6 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="aspect-square rounded-lg mb-3" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  const trendingForTable = trending.map((t, i) => ({
    ...t,
    rank: i + 1,
    releaseDate: "2024",
    album: t.title,
    duration: t.duration ? `${Math.floor(t.duration / 60)}:${String(t.duration % 60).padStart(2, "0")}` : "3:00",
  }));

  return (
    <main className="pb-8">
      <HeroBanner />
      <SongSection title="Weekly Top Songs" highlightedWord="Songs" songs={weeklyTop} />
      <SongSection title="New Release Songs" highlightedWord="Songs" songs={newRelease} />
      <TrendingSongs songs={trendingForTable} />
    </main>
  );
};

export default Dashboard;
