import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserDataProvider } from "@/contexts/UserDataContext";
import { PlayerBar } from "@/components/player/PlayerBar";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardHome from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Albums from "./pages/Albums";
import Artists from "./pages/Artists";
import RecentlyAdded from "./pages/RecentlyAdded";
import MostPlayed from "./pages/MostPlayed";
import Favorites from "./pages/Favorites";
import Playlists from "./pages/Playlists";
import AddPlaylist from "./pages/AddPlaylist";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <UserDataProvider>
          <MusicPlayerProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="artists" element={<Artists />} />
                  <Route path="albums" element={<Albums />} />
                  <Route path="recent" element={<RecentlyAdded />} />
                  <Route path="most-played" element={<MostPlayed />} />
                  <Route path="favorites" element={<Favorites />} />
                  <Route path="playlists" element={<Playlists />} />
                  <Route path="add-playlist" element={<AddPlaylist />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                <Route path="/discover" element={<DashboardLayout />}>
                  <Route index element={<Discover />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <PlayerBar />
          </MusicPlayerProvider>
        </UserDataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
