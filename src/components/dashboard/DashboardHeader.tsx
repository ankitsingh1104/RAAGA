import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useYouTubeSearch } from "@/hooks/useYouTubeSearch";
import { SearchResults } from "@/components/search/SearchResults";
import { useDebounce } from "@/hooks/useDebounce";

export function DashboardHeader() {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const { results, isLoading, error, searchTracks, clearResults } = useYouTubeSearch();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debouncedQuery) {
      searchTracks(debouncedQuery);
      setShowResults(true);
    } else {
      clearResults();
      setShowResults(false);
    }
  }, [debouncedQuery, searchTracks, clearResults]);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    setQuery("");
    clearResults();
    setShowResults(false);
  };

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-4">
      <div ref={searchContainerRef} className="relative flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
        <Input
          type="search"
          placeholder="Search songs, artists..."
          className="pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => (results.length > 0 || isLoading) && setShowResults(true)}
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Search Results Dropdown */}
        {showResults && (query || results.length > 0 || isLoading) && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-xl z-50 p-4">
            <SearchResults
              results={results}
              isLoading={isLoading}
              error={error}
              onClose={() => setShowResults(false)}
            />
            {!isLoading && results.length === 0 && query && (
              <p className="text-center text-muted-foreground py-4">
                No results found for "{query}"
              </p>
            )}
          </div>
        )}
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
