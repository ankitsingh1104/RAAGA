import { useMusicPlayer, Track } from "@/contexts/MusicPlayerContext";

interface MoodPlaylistCardProps {
  title: string;
  image: string;
  tracks: Track[];
}

export function MoodPlaylistCard({ title, image, tracks }: MoodPlaylistCardProps) {
  const { playTrack } = useMusicPlayer();

  const handleClick = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div
      className="w-[120px] flex-shrink-0 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="aspect-square rounded-lg overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
      </div>
      <p className="mt-2 text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors">
        {title}
      </p>
    </div>
  );
}
