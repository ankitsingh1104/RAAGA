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

const albums = [
  { id: 1, src: album1, alt: "Album 1" },
  { id: 2, src: album2, alt: "Album 2" },
  { id: 3, src: album3, alt: "Album 3" },
  { id: 4, src: album4, alt: "Album 4" },
  { id: 5, src: album5, alt: "Album 5" },
  { id: 6, src: album6, alt: "Album 6" },
  { id: 7, src: album7, alt: "Album 7" },
  { id: 8, src: album8, alt: "Album 8" },
  { id: 9, src: album9, alt: "Album 9" },
  { id: 10, src: album10, alt: "Album 10" },
  { id: 11, src: album11, alt: "Album 11" },
  { id: 12, src: album12, alt: "Album 12" },
];

const AlbumGrid = () => {
  return (
    <div className="grid grid-cols-4 gap-4 p-4 max-w-6xl mx-auto">
      {albums.map((album, index) => (
        <div
          key={album.id}
          className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:z-10"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <img
            src={album.src}
            alt={album.alt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        </div>
      ))}
    </div>
  );
};

export default AlbumGrid;
