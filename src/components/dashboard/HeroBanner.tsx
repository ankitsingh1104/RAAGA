import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-cassettes.jpg";

export function HeroBanner() {
  return (
    <section className="relative mx-6 rounded-2xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Vintage cassette tapes"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-16 px-8 md:px-12 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          All the <span className="text-primary">Best Songs</span>
          <br />
          in One Place
        </h2>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8 max-w-md">
          On our website, you can access an amazing collection of popular and new songs. 
          Stream your favorite tracks in high quality and enjoy without interruptions. 
          Whatever your taste in music, we have it all for you!
        </p>
        <div className="flex items-center gap-4">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">
            Discover Now
          </Button>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6"
          >
            Create Playlist
          </Button>
        </div>
      </div>
    </section>
  );
}
