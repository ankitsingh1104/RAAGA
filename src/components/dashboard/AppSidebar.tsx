import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  Disc,
  Users,
  Clock,
  Star,
  Heart,
  ListMusic,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Discover", url: "/dashboard/discover", icon: Compass },
  { title: "Albums", url: "/dashboard/albums", icon: Disc },
  { title: "Artists", url: "/dashboard/artists", icon: Users },
];

const libraryItems = [
  { title: "Recently Added", url: "/dashboard/recent", icon: Clock },
  { title: "Most Played", url: "/dashboard/most-played", icon: Star },
];

const playlistItems = [
  { title: "Your Favorites", url: "/dashboard/favorites", icon: Heart },
  { title: "Your Playlist", url: "/dashboard/playlists", icon: ListMusic },
  { title: "Add Playlist", url: "/dashboard/add-playlist", icon: PlusCircle, accent: true },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <NavLink to="/dashboard" className="flex items-center">
          <h1 className="text-2xl font-bold tracking-wider text-foreground">RAAGA</h1>
        </NavLink>
      </SidebarHeader>

      <SidebarContent>
        {/* Menu Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary text-xs font-medium px-4">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Library Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary text-xs font-medium px-4">
            Library
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Playlist Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary text-xs font-medium px-4">
            Playlist and Favorite
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {playlistItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                        item.accent
                          ? "text-primary hover:text-primary hover:bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                      activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* General Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary text-xs font-medium px-4">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                    activeClassName="bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Setting</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-primary hover:bg-primary/10 transition-colors w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
