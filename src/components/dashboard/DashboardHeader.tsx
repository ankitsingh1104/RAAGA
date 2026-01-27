import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export function DashboardHeader() {
  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search For Musics, Artists, ..."
          className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
        />
      </div>
      <nav className="flex items-center gap-8">
        <Link
          to="/dashboard/about"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          About Us
        </Link>
        <Link
          to="/dashboard/contact"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
