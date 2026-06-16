/** Service to fetch and parse IPTV M3U playlists from iptv-org.
 *  iptv-org hosts publicly available M3U playlists with TV channel streams.
 */

export interface IPTVChannel {
  id: string;
  name: string;
  logo: string | null;
  group: string;
  url: string;
  language: string;
  country: string;
  quality: string;
}

const IPTV_BASE = "https://iptv-org.github.io/iptv";

/** Fetch the main playlist or a category-specific one. */
async function fetchM3U(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch M3U: ${response.status}`);
  return response.text();
}

/** Parse an M3U playlist into IPTVChannel objects. */
export function parseM3U(content: string): IPTVChannel[] {
  const lines = content.split("\n");
  const channels: IPTVChannel[] = [];
  let currentMeta: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#EXTINF:")) {
      currentMeta = parseExtinf(trimmed);
    } else if (trimmed && !trimmed.startsWith("#")) {
      channels.push({
        id: `ch_${channels.length}`,
        name: currentMeta["tvg-name"] ?? currentMeta.name ?? "Unknown",
        logo: currentMeta["tvg-logo"] ?? null,
        group: currentMeta["group-title"] ?? "Uncategorized",
        url: trimmed,
        language: currentMeta["tvg-language"] ?? "N/A",
        country: currentMeta["tvg-country"] ?? "N/A",
        quality: detectQuality(currentMeta["tvg-name"] ?? trimmed),
      });
      currentMeta = {};
    }
  }

  return channels;
}

function parseExtinf(line: string): Record<string, string> {
  const meta: Record<string, string> = {};
  const attrRegex = /([\w-]+)="([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = attrRegex.exec(line)) !== null) {
    meta[match[1]] = match[2];
  }
  const namePart = line.split(",").pop()?.trim();
  if (namePart) meta.name = namePart;
  return meta;
}

function detectQuality(name: string): string {
  const upper = name.toUpperCase();
  if (upper.includes("4K") || upper.includes("UHD")) return "4K";
  if (upper.includes("FHD") || upper.includes("1080")) return "FHD";
  if (upper.includes("HD") || upper.includes("720")) return "HD";
  if (upper.includes("SD")) return "SD";
  return "HD";
}

const SPORTS_KEYWORDS = [
  "sport", "espn", "fox sport", "bein sport", "sky sport", "dazn",
  "canal+ sport", "supersport", "premier sport", "eleven sport",
  "match", "football", "soccer", "fifa", "world cup", "coupe du monde",
  "rtve", "tf1", "bbc", "itv", "rai", "ard", "zdf", "nos", "rtbf",
  "movistar", "gol", "liga", "champions", "serie a", "bundesliga",
];

/** Fetch sports channels from the iptv-org sports category playlist. */
export async function fetchSportsChannels(): Promise<IPTVChannel[]> {
  try {
    const urls = [
      `${IPTV_BASE}/categories/sports.m3u`,
      `${IPTV_BASE}/index.m3u`,
    ];

    for (const url of urls) {
      try {
        const content = await fetchM3U(url);
        const allChannels = parseM3U(content);
        const sportsChannels = allChannels.filter((ch) => {
          const searchText = `${ch.name} ${ch.group}`.toLowerCase();
          return SPORTS_KEYWORDS.some((kw) => searchText.includes(kw));
        });
        if (sportsChannels.length > 0) return sportsChannels.slice(0, 60);
      } catch {
        continue;
      }
    }
    return [];
  } catch {
    return [];
  }
}

/** Search channels by name or group. */
export function searchChannels(channels: IPTVChannel[], query: string): IPTVChannel[] {
  const q = query.toLowerCase();
  return channels.filter(
    (ch) =>
      ch.name.toLowerCase().includes(q) ||
      ch.group.toLowerCase().includes(q) ||
      ch.country.toLowerCase().includes(q)
  );
}

/** Get featured channels — curated list for quick access. */
export function getFeaturedChannels(channels: IPTVChannel[]): IPTVChannel[] {
  const featuredNames = ["bein sport", "espn", "fox sport", "bbc", "tf1", "canal+ sport", "sky sport"];
  return channels.filter((ch) =>
    featuredNames.some((n) => ch.name.toLowerCase().includes(n))
  ).slice(0, 10);
}
