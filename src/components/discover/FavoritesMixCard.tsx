import { Music } from "lucide-react";

export function FavoritesMixCard() {
  return (
    <div className="relative w-full h-[280px] rounded-2xl overflow-hidden cursor-pointer group">
      {/* Gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #FF6B6B 0%, #FF8E53 25%, #FFC857 50%, #FF6B9D 75%, #C44D8E 100%)"
        }}
      />
      
      {/* Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30" />
      
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div className="flex items-center gap-2 text-foreground/90">
          <Music className="h-4 w-4" />
          <span className="text-sm font-medium">Music</span>
        </div>
        
        <div>
          <h3 className="text-3xl font-bold text-foreground mb-1">Favorites</h3>
          <p className="text-2xl font-light text-foreground/90">Mix</p>
        </div>
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </div>
  );
}
