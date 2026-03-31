import { Settings as SettingsIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { userName, isLoggedIn } = useAuth();

  const clearHistory = () => {
    localStorage.removeItem("music_listening_history");
    window.location.reload();
  };

  return (
    <div className="px-6 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">
        <SettingsIcon className="inline-block mr-2 h-6 w-6 text-primary" />
        <span className="text-primary">Settings</span>
      </h1>

      <div className="space-y-6">
        <div className="bg-card rounded-lg border border-border/50 p-6">
          <h2 className="font-semibold mb-2">Account</h2>
          <p className="text-sm text-muted-foreground">
            {isLoggedIn ? `Logged in as ${userName}` : "Not logged in"}
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border/50 p-6">
          <h2 className="font-semibold mb-2">Playback</h2>
          <p className="text-sm text-muted-foreground mb-4">Music is played via YouTube IFrame Player API.</p>
        </div>

        <div className="bg-card rounded-lg border border-border/50 p-6">
          <h2 className="font-semibold mb-2">Data</h2>
          <p className="text-sm text-muted-foreground mb-4">Clear your listening history and cached data.</p>
          <Button variant="destructive" onClick={clearHistory}>
            Clear Listening History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
