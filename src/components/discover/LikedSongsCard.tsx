import { Heart } from "lucide-react";

interface LikedSongsCardProps {
  songCount?: number;
}

export function LikedSongsCard({ songCount = 100 }: LikedSongsCardProps) {
  return (
    <div className="relative w-full h-[140px] rounded-xl overflow-hidden cursor-pointer group">
      {/* Gradient background - purple to pink */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
        }}
      />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute top-4 right-4 w-24 h-24 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)" }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-5 h-full flex flex-col justify-end">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="h-5 w-5 text-foreground" fill="currentColor" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Liked</h3>
        <p className="text-lg font-light text-foreground/90">Songs</p>
        <p className="text-xs text-foreground/70 mt-1">{songCount} Songs</p>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  );
}
