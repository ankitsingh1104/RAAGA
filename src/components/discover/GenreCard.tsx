import { useMusicPlayer, Track } from "@/contexts/MusicPlayerContext";

interface GenreCardProps {
  title: string;
  image: string;
  tracks: Track[];
}

export function GenreCard({ title, image, tracks }: GenreCardProps) {
  const { playTrack } = useMusicPlayer();

  const handleClick = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0], tracks);
    }
  };

  return (
    <div
      className="relative w-[160px] h-[100px] rounded-lg overflow-hidden cursor-pointer group flex-shrink-0"
      onClick={handleClick}
    >
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-3 left-3">
        <span className="text-sm font-semibold text-foreground">{title}</span>
      </div>
      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors" />
    </div>
  );
}
