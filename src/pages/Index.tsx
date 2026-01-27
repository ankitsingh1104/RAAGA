import Navbar from "@/components/Navbar";
import AlbumGrid from "@/components/AlbumGrid";
import HeroText from "@/components/HeroText";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />
      
      <main className="relative pt-20 pb-10">
        <AlbumGrid />
        <HeroText />
      </main>
    </div>
  );
};

export default Index;
