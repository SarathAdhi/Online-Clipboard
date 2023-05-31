interface UrlStats {
  browser: string;
  type: string;
  os: string;
  visitedAt: string;
}

interface Url {
  id: number;
  url: string;
  name: string;
  stats: UrlStats[];
}
