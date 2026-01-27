import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { SongSection } from "@/components/dashboard/SongSection";
import { TrendingSongs } from "@/components/dashboard/TrendingSongs";

// Import album covers
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

const weeklyTopSongs = [
  { id: 1, title: "Whatever It Takes", artist: "Imagine Dragons", cover: album1 },
  { id: 2, title: "Skyfall", artist: "Adele", cover: album2 },
  { id: 3, title: "Superman", artist: "Eminem", cover: album3 },
  { id: 4, title: "Softcore", artist: "The Neighbourhood", cover: album4 },
  { id: 5, title: "The Lonliest", artist: "Måneskin", cover: album5 },
];

const newReleaseSongs = [
  { id: 6, title: "Time", artist: "Luciano", cover: album6 },
  { id: 7, title: "112", artist: "Jazzek", cover: album7 },
  { id: 8, title: "We Don't Care", artist: "Kyanu & Dj Gollum", cover: album8 },
  { id: 9, title: "Who I Am", artist: "Alan Walker & Elias", cover: album9 },
  { id: 10, title: "Baixo", artist: "XXAnteria", cover: album10 },
];

const trendingSongs = [
  {
    id: 1,
    rank: 1,
    title: "Softcore",
    artist: "The Neighborhood",
    cover: album4,
    releaseDate: "Nov 4, 2023",
    album: "Hard to Imagine the Neighbourhood Ever Changing",
    duration: "3:26",
    liked: true,
  },
  {
    id: 2,
    rank: 2,
    title: "Skyfall Beats",
    artist: "nightmares",
    cover: album2,
    releaseDate: "Oct 26, 2023",
    album: "nightmares",
    duration: "2:45",
  },
  {
    id: 3,
    rank: 3,
    title: "Greedy",
    artist: "Tate McRae",
    cover: album3,
    releaseDate: "Dec 30, 2023",
    album: "Greedy",
    duration: "2:11",
  },
  {
    id: 4,
    rank: 4,
    title: "Lovin On Me",
    artist: "Jack Harlow",
    cover: album1,
    releaseDate: "Dec 30, 2023",
    album: "Lovin On Me",
    duration: "2:18",
  },
  {
    id: 5,
    rank: 5,
    title: "Paint The Town Red",
    artist: "Doja Cat",
    cover: album5,
    releaseDate: "Dec 29, 2023",
    album: "Paint The Town Red",
    duration: "3:51",
  },
  {
    id: 6,
    rank: 6,
    title: "Dance The Night",
    artist: "Dua Lipa",
    cover: album6,
    releaseDate: "May 27, 2023",
    album: "Dance The Night (From Barbie Movie)",
    duration: "2:56",
  },
  {
    id: 7,
    rank: 7,
    title: "Water",
    artist: "Tyla",
    cover: album7,
    releaseDate: "Dec 10, 2023",
    album: "Water",
    duration: "3:20",
  },
];

const Dashboard = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <DashboardHeader />
          <main className="pb-8">
            <HeroBanner />
            <SongSection
              title="Weekly Top Songs"
              highlightedWord="Songs"
              songs={weeklyTopSongs}
            />
            <SongSection
              title="New Release Songs"
              highlightedWord="Songs"
              songs={newReleaseSongs}
            />
            <TrendingSongs songs={trendingSongs} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
