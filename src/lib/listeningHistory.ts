const STORAGE_KEY = "music_listening_history";
const MAX_HISTORY = 200;

export interface ListeningEntry {
  videoId: string;
  title: string;
  artist: string;
  genre: string;
  timestamp: number;
}

function inferGenre(title: string, artist: string): string {
  const text = `${title} ${artist}`.toLowerCase();
  const genreMap: Record<string, string[]> = {
    pop: ["pop", "hit", "billboard", "chart", "top"],
    "hip-hop": ["rap", "hip hop", "hip-hop", "trap", "drill"],
    rock: ["rock", "metal", "punk", "grunge", "alternative"],
    "r&b": ["r&b", "rnb", "soul", "neo soul", "r & b"],
    electronic: ["edm", "electronic", "house", "techno", "dubstep", "dj"],
    indie: ["indie", "lo-fi", "lofi", "chill"],
    country: ["country", "nashville", "folk"],
    latin: ["latin", "reggaeton", "bachata", "salsa"],
  };

  for (const [genre, keywords] of Object.entries(genreMap)) {
    if (keywords.some((kw) => text.includes(kw))) return genre;
  }
  return "pop"; // default
}

export function recordPlay(videoId: string, title: string, artist: string): void {
  const history = getHistory();
  const entry: ListeningEntry = {
    videoId,
    title,
    artist,
    genre: inferGenre(title, artist),
    timestamp: Date.now(),
  };
  history.unshift(entry);
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getHistory(): ListeningEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getTopGenres(count = 2): string[] {
  const history = getHistory();
  const freq: Record<string, number> = {};
  history.forEach((e) => {
    freq[e.genre] = (freq[e.genre] || 0) + 1;
  });
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([g]) => g);
}

const timeQueries: Record<string, string[]> = {
  morning: ["upbeat morning music", "feel good pop songs", "happy acoustic songs"],
  afternoon: ["chill afternoon vibes", "popular pop songs", "driving music playlist"],
  evening: ["relaxing evening songs", "smooth R&B evening", "indie evening chill"],
  night: ["late night chill music", "ambient night songs", "slow songs night mood"],
};

export function buildRecommendationQuery(): string {
  const topGenres = getTopGenres(2);
  const time = getTimeOfDay();
  const timeQ = timeQueries[time];
  const randomTimeQ = timeQ[Math.floor(Math.random() * timeQ.length)];

  if (topGenres.length === 0) return randomTimeQ;

  const genrePart = topGenres[Math.floor(Math.random() * topGenres.length)];
  return `${genrePart} ${randomTimeQ}`;
}
