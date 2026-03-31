import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserData } from "@/contexts/UserDataContext";
import { useToast } from "@/hooks/use-toast";

const AddPlaylist = () => {
  const [name, setName] = useState("");
  const { createPlaylist } = useUserData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createPlaylist(name.trim());
    toast({ title: "Playlist created!", description: `"${name}" has been added to your playlists.` });
    setName("");
    navigate("/dashboard/playlists");
  };

  return (
    <div className="px-6 py-6 max-w-md">
      <h1 className="text-2xl font-bold mb-6">
        <PlusCircle className="inline-block mr-2 h-6 w-6 text-primary" />
        Create <span className="text-primary">Playlist</span>
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="playlist-name">Playlist Name</Label>
          <Input
            id="playlist-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Awesome Playlist"
            className="bg-secondary/50 border-border/50 focus:border-primary"
            required
          />
        </div>
        <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Create Playlist
        </Button>
      </form>
    </div>
  );
};

export default AddPlaylist;
