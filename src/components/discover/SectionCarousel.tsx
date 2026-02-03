import { ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Track } from "@/contexts/MusicPlayerContext";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

interface SectionCarouselProps {
  title: string;
  highlightedWord?: string;
  tracks: Track[];
  isLoading?: boolean;
  variant?: "default" | "video" | "round" | "album";
}

export function SectionCarousel({
  title,
  highlightedWord,
  tracks,
  isLoading = false,
  variant = "default",
}: SectionCarouselProps) {
  const { playTrack } = useMusicPlayer();

  const renderTitle = () => {
    if (!highlightedWord) {
      return <span className="text-foreground">{title}</span>;
    }
    const parts = title.split(highlightedWord);
    return (
      <>
        <span className="text-foreground">{parts[0]}</span>
        <span className="text-primary">{highlightedWord}</span>
        {parts[1] && <span className="text-foreground">{parts[1]}</span>}
      </>
    );
  };

  const handlePlay = (track: Track) => {
    playTrack(track, tracks);
  };

  const getCardClass = () => {
    switch (variant) {
      case "video":
        return "w-[200px] flex-shrink-0";
      case "round":
        return "w-[120px] flex-shrink-0";
      case "album":
        return "w-[160px] flex-shrink-0";
      default:
        return "w-[160px] flex-shrink-0";
    }
  };

  const getImageClass = () => {
    switch (variant) {
      case "video":
        return "aspect-video rounded-lg";
      case "round":
        return "aspect-square rounded-full";
      case "album":
        return "aspect-square rounded-lg";
      default:
        return "aspect-square rounded-lg";
    }
  };

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-6">
        <h2 className="text-xl font-bold">{renderTitle()}</h2>
        <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          View All
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 px-6 pb-4">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={getCardClass()}>
                  <Skeleton className={`${getImageClass()} w-full`} />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Skeleton className="h-3 w-1/2 mt-1" />
                </div>
              ))
            : tracks.map((track) => (
                <div
                  key={track.id}
                  className={`${getCardClass()} cursor-pointer group`}
                  onClick={() => handlePlay(track)}
                >
                  <div className={`${getImageClass()} overflow-hidden relative`}>
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
                  <h3 className="mt-2 text-sm font-medium text-foreground truncate">
                    {track.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {track.artist}
                  </p>
                </div>
              ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
