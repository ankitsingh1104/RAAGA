import { ArrowLeft, Heart, MoreHorizontal, Play, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

import album1 from "@/assets/album-1.jpg";
import album2 from "@/assets/album-2.jpg";
import album3 from "@/assets/album-3.jpg";
import album4 from "@/assets/album-4.jpg";
import album5 from "@/assets/album-5.jpg";
import album6 from "@/assets/album-6.jpg";
import album7 from "@/assets/album-7.jpg";
import album8 from "@/assets/album-8.jpg";
import album9 from "@/assets/album-9.jpg";
import album10 from "@/assets/album-10.jpg";
import album11 from "@/assets/album-11.jpg";
import album12 from "@/assets/album-12.jpg";

const trendingSongs = [
  { id: 1, rank: 1, title: "Softcore", artist: "The Neighbourhood", cover: album4, releaseDate: "Nov 4, 2023", album: "Hard to Imagine Neighbourhood Ever Changing", duration: "3:26", liked: true },
  { id: 2, rank: 2, title: "Skyfall Beats", artist: "nightmares", cover: album2, releaseDate: "Oct 26, 2023", album: "nightmares", duration: "2:45", liked: false },
  { id: 3, rank: 3, title: "Greedy", artist: "Tate McRae", cover: album3, releaseDate: "Nov 30, 2023", album: "Greedy", duration: "2:11", liked: false },
  { id: 4, rank: 4, title: "Lovin On Me", artist: "Jack Harlow", cover: album1, releaseDate: "Dec 15, 2023", album: "Lovin On Me", duration: "2:18", liked: false },
  { id: 5, rank: 5, title: "Paint The Town Red", artist: "Doja Cat", cover: album5, releaseDate: "Dec 29, 2023", album: "Paint The Town Red", duration: "3:51", liked: false },
  { id: 6, rank: 6, title: "Dancin On Night", artist: "Dua Lipa", cover: album6, releaseDate: "May 27, 2023", album: "Dance The Night (From Barbie Movie)", duration: "2:56", liked: false },
  { id: 7, rank: 7, title: "Water", artist: "Tyla", cover: album7, releaseDate: "Oct 21, 2023", album: "Water", duration: "3:20", liked: false },
  { id: 8, rank: 8, title: "Push Your Limits", artist: "Brian Michael", cover: album8, releaseDate: "Jan 2, 2024", album: "Push Your Limits", duration: "2:24", liked: false },
  { id: 9, rank: 9, title: "Houdini", artist: "Dua Lipa", cover: album9, releaseDate: "Dec 12, 2023", album: "Houdini", duration: "3:05", liked: false },
  { id: 10, rank: 10, title: "Lala", artist: "Myke Towers", cover: album10, releaseDate: "Nov 20, 2023", album: "La vida es una", duration: "3:17", liked: false },
  { id: 11, rank: 11, title: "I Wanna Be Yours", artist: "Arctic Monkeys", cover: album11, releaseDate: "Sep 9, 2023", album: "AM", duration: "3:03", liked: false },
  { id: 12, rank: 12, title: "Paradise", artist: "Coldplay", cover: album12, releaseDate: "Jul 5, 2023", album: "Paradise", duration: "2:30", liked: false },
  { id: 13, rank: 13, title: "As It Was", artist: "Harry Styles", cover: album1, releaseDate: "Sep 14, 2022", album: "As It Was", duration: "2:47", liked: false },
  { id: 14, rank: 14, title: "Another Love", artist: "Tom Odell", cover: album2, releaseDate: "Dec 19, 2013", album: "Another Love", duration: "4:06", liked: false },
  { id: 15, rank: 15, title: "Daylight", artist: "David Kushner", cover: album3, releaseDate: "Jun 16, 2022", album: "Daylight", duration: "3:32", liked: false },
  { id: 16, rank: 16, title: "Beggin", artist: "Måneskin", cover: album4, releaseDate: "Feb 27, 2017", album: "Chosen", duration: "3:31", liked: false },
  { id: 17, rank: 17, title: "What Was I Made For", artist: "Billie Eilish", cover: album5, releaseDate: "Sep 6, 2023", album: "What Was I Made For", duration: "3:42", liked: false },
  { id: 18, rank: 18, title: "Daddy Issues", artist: "The Neighbourhood", cover: album6, releaseDate: "Aug 21, 2015", album: "Wiped Out", duration: "4:20", liked: false },
  { id: 19, rank: 19, title: "Rolling In The Deep", artist: "Adele", cover: album7, releaseDate: "Jun 5, 2011", album: "Adele 21", duration: "3:48", liked: false },
  { id: 20, rank: 20, title: "OneShot", artist: "mifist", cover: album8, releaseDate: "Dec 14, 2023", album: "Toca Dorika", duration: "1:15", liked: false },
];

const Discover = () => {
  const navigate = useNavigate();
  const { playTrack, currentTrack, isPlaying, toggle } = useMusicPlayer();

  const playlist = trendingSongs.map((s) => ({
    id: s.id,
    title: s.title,
    artist: s.artist,
    cover: s.cover,
  }));

  const handlePlayAll = () => {
    if (playlist.length > 0) {
      playTrack(playlist[0], playlist);
    }
  };

  const handleRowClick = (song: typeof trendingSongs[0]) => {
    if (currentTrack?.id === song.id) {
      toggle();
    } else {
      playTrack(
        { id: song.id, title: song.title, artist: song.artist, cover: song.cover },
        playlist
      );
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-secondary via-background to-background min-h-screen pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="text-foreground hover:text-primary"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Share</span>
          <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">About</span>
          <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Premium</span>
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-xs">👤</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 py-8 flex items-start gap-6">
        <div className="relative w-48 h-48 rounded-lg overflow-hidden shadow-2xl">
          <img
            src={album4}
            alt="Trending Music"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-transparent" />
          <div className="absolute top-4 left-4">
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">TRENDING</p>
            <p className="text-lg font-bold text-foreground">MUSIC</p>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">
            Trending songs <span className="text-primary">mix</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            tate mcree, nightmares, the neighborhood, doja cat and ...
          </p>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-muted-foreground">20 songs</span>
            <span className="text-primary">•</span>
            <span className="text-sm text-muted-foreground">1h 36m</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-primary font-medium">Play All</span>
            <Button
              size="icon"
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handlePlayAll}
            >
              <Play className="h-5 w-5 ml-0.5" fill="currentColor" />
            </Button>
          </div>
        </div>
      </div>

      {/* Songs Table */}
      <div className="px-6">
        <div className="grid grid-cols-[40px_1fr_150px_1fr_80px_40px] gap-4 py-3 text-sm text-muted-foreground border-b border-border/30">
          <span></span>
          <span></span>
          <span>Release Date</span>
          <span>Album</span>
          <span className="text-right">Time</span>
          <span></span>
        </div>

        <ScrollArea className="h-[calc(100vh-420px)]">
          <div className="divide-y divide-border/20">
            {trendingSongs.map((song) => {
              const isCurrentSong = currentTrack?.id === song.id;
              const isThisPlaying = isCurrentSong && isPlaying;

              return (
                <div
                  key={song.id}
                  className={`grid grid-cols-[40px_1fr_150px_1fr_80px_40px] gap-4 py-3 items-center hover:bg-secondary/20 transition-colors group cursor-pointer ${isCurrentSong ? 'bg-secondary/30' : ''}`}
                  onClick={() => handleRowClick(song)}
                >
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    <span className={`text-primary font-bold ${isCurrentSong ? 'opacity-0' : 'group-hover:opacity-0'}`}>
                      {song.rank}
                    </span>
                    <div className={`absolute inset-0 flex items-center justify-center ${isCurrentSong ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {isThisPlaying ? (
                        <Pause className="h-4 w-4 text-primary" fill="currentColor" />
                      ) : (
                        <Play className="h-4 w-4 text-primary" fill="currentColor" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <h4 className={`font-medium text-sm ${isCurrentSong ? 'text-primary' : 'text-foreground'}`}>{song.title}</h4>
                      <p className="text-xs text-muted-foreground">{song.artist}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{song.releaseDate}</span>
                  <span className="text-sm text-muted-foreground truncate">{song.album}</span>
                  <div className="flex items-center justify-end gap-2">
                    <Heart
                      className={`h-4 w-4 ${song.liked ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"} transition-colors cursor-pointer`}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm text-muted-foreground">{song.duration}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="absolute bottom-24 right-6 flex flex-col items-end gap-4">
        <h2 className="text-2xl font-bold text-foreground/80 tracking-wider">Raaga</h2>
        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="cursor-pointer hover:text-foreground transition-colors">📱</span>
          <span className="cursor-pointer hover:text-foreground transition-colors">📷</span>
          <span className="cursor-pointer hover:text-foreground transition-colors">🐦</span>
          <span className="cursor-pointer hover:text-foreground transition-colors">📞</span>
        </div>
      </div>
    </div>
  );
};

export default Discover;
