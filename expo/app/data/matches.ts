export type MatchStatus = "upcoming" | "live" | "finished" | "halftime";

export interface MatchEvent {
  minute: number;
  type: "goal" | "yellow_card" | "red_card" | "substitution";
  teamId: string;
  player: string;
  detail?: string;
}

export interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  date: string;
  time: string;
  group: string;
  stage: "group" | "round_of_32" | "round_of_16" | "quarterfinal" | "semifinal" | "third_place" | "final";
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  venue: string;
  events: MatchEvent[];
  broadcastChannels: string[];
}

const STADIUMS = [
  "MetLife Stadium, New Jersey",
  "AT&T Stadium, Texas",
  "SoFi Stadium, Los Angeles",
  "Hard Rock Stadium, Miami",
  "Mercedes-Benz Stadium, Atlanta",
  "Arrowhead Stadium, Kansas City",
  "Levi's Stadium, Santa Clara",
  "Lumen Field, Seattle",
  "NRG Stadium, Houston",
  "Lincoln Financial Field, Philadelphia",
  "Gillette Stadium, Boston",
  "BC Place, Vancouver",
  "Estadio Azteca, Mexico City",
  "Estadio BBVA, Monterrey",
  "Estadio Akron, Guadalajara",
  "BMO Field, Toronto",
];

function stadiumFor(matchIndex: number): string {
  return STADIUMS[matchIndex % STADIUMS.length];
}

/** Simulated World Cup 2026 schedule — the tournament runs Jun 11–Jul 19 2026.
 *  Today 2026-06-15 is matchday 4 — group stage in full swing. */
export function getWorldCupMatches(): Match[] {
  const matches: Match[] = [
    // Jun 11 — Opening day
    { id: "m01", homeTeamId: "usa", awayTeamId: "senegal", date: "2026-06-11", time: "20:00", group: "A", stage: "group", status: "finished", homeScore: 2, awayScore: 0, venue: stadiumFor(0), events: [{ minute: 23, type: "goal", teamId: "usa", player: "Pulisic" }, { minute: 67, type: "goal", teamId: "usa", player: "Balogun" }], broadcastChannels: ["beIN Sports", "Fox Sports", "BBC One"] },
    // Jun 12
    { id: "m02", homeTeamId: "mexico", awayTeamId: "ukraine", date: "2026-06-12", time: "15:00", group: "A", stage: "group", status: "finished", homeScore: 1, awayScore: 1, venue: stadiumFor(1), events: [{ minute: 41, type: "goal", teamId: "mexico", player: "Jimenez" }, { minute: 78, type: "goal", teamId: "ukraine", player: "Dovbyk" }], broadcastChannels: ["beIN Sports", "ESPN", "TF1"] },
    { id: "m03", homeTeamId: "argentina", awayTeamId: "south_korea", date: "2026-06-12", time: "20:00", group: "B", stage: "group", status: "finished", homeScore: 4, awayScore: 1, venue: stadiumFor(2), events: [{ minute: 12, type: "goal", teamId: "argentina", player: "Messi" }, { minute: 35, type: "goal", teamId: "argentina", player: "Alvarez" }, { minute: 52, type: "goal", teamId: "argentina", player: "Messi" }, { minute: 72, type: "goal", teamId: "south_korea", player: "Son" }, { minute: 88, type: "goal", teamId: "argentina", player: "Lautaro" }], broadcastChannels: ["beIN Sports", "ESPN", "BBC One"] },
    // Jun 13
    { id: "m04", homeTeamId: "portugal", awayTeamId: "morocco", date: "2026-06-13", time: "15:00", group: "B", stage: "group", status: "finished", homeScore: 2, awayScore: 2, venue: stadiumFor(3), events: [{ minute: 28, type: "goal", teamId: "portugal", player: "Ronaldo" }, { minute: 45, type: "goal", teamId: "morocco", player: "Hakimi" }, { minute: 64, type: "goal", teamId: "morocco", player: "En-Nesyri" }, { minute: 89, type: "goal", teamId: "portugal", player: "Bruno Fernandes" },], broadcastChannels: ["beIN Sports", "RMC Sport", "BBC Two"] },
    { id: "m05", homeTeamId: "france", awayTeamId: "australia", date: "2026-06-13", time: "20:00", group: "C", stage: "group", status: "finished", homeScore: 3, awayScore: 0, venue: stadiumFor(4), events: [{ minute: 15, type: "goal", teamId: "france", player: "Mbappe" }, { minute: 44, type: "goal", teamId: "france", player: "Griezmann" }, { minute: 81, type: "goal", teamId: "france", player: "Dembele" }], broadcastChannels: ["beIN Sports", "TF1", "ESPN"] },
    // Jun 14
    { id: "m06", homeTeamId: "brazil", awayTeamId: "egypt", date: "2026-06-14", time: "15:00", group: "C", stage: "group", status: "finished", homeScore: 2, awayScore: 1, venue: stadiumFor(5), events: [{ minute: 19, type: "goal", teamId: "brazil", player: "Vinicius Jr" }, { minute: 55, type: "goal", teamId: "egypt", player: "Salah" }, { minute: 74, type: "goal", teamId: "brazil", player: "Rodrygo" }], broadcastChannels: ["beIN Sports", "Globo", "BBC One"] },
    { id: "m07", homeTeamId: "england", awayTeamId: "canada", date: "2026-06-14", time: "20:00", group: "D", stage: "group", status: "finished", homeScore: 3, awayScore: 1, venue: stadiumFor(6), events: [{ minute: 8, type: "goal", teamId: "england", player: "Kane" }, { minute: 33, type: "goal", teamId: "england", player: "Saka" }, { minute: 61, type: "goal", teamId: "canada", player: "Davies" }, { minute: 85, type: "goal", teamId: "england", player: "Bellingham" }], broadcastChannels: ["beIN Sports", "BBC One", "TSN"] },
    // Jun 15 — TODAY (LIVE & UPCOMING)
    { id: "m08", homeTeamId: "spain", awayTeamId: "japan", date: "2026-06-15", time: "15:00", group: "D", stage: "group", status: "live", homeScore: 1, awayScore: 0, venue: stadiumFor(7), events: [{ minute: 37, type: "goal", teamId: "spain", player: "Morata" }, { minute: 62, type: "yellow_card", teamId: "japan", player: "Tomiyasu" }], broadcastChannels: ["beIN Sports", "RTVE", "NHK"] },
    { id: "m09", homeTeamId: "germany", awayTeamId: "saudi_arabia", date: "2026-06-15", time: "17:00", group: "E", stage: "group", status: "live", homeScore: 0, awayScore: 0, venue: stadiumFor(8), events: [], broadcastChannels: ["beIN Sports", "ARD", "SSC"] },
    { id: "m10", homeTeamId: "netherlands", awayTeamId: "ivory_coast", date: "2026-06-15", time: "20:00", group: "E", stage: "group", status: "upcoming", homeScore: null, awayScore: null, venue: stadiumFor(9), events: [], broadcastChannels: ["beIN Sports", "NOS", "Canal+"] },
    { id: "m11", homeTeamId: "italy", awayTeamId: "qatar", date: "2026-06-15", time: "22:00", group: "F", stage: "group", status: "upcoming", homeScore: null, awayScore: null, venue: stadiumFor(10), events: [], broadcastChannels: ["beIN Sports", "RAI", "Al Kass"] },
    // Jun 16
    { id: "m12", homeTeamId: "uruguay", awayTeamId: "nigeria", date: "2026-06-16", time: "15:00", group: "F", stage: "group", status: "upcoming", homeScore: null, awayScore: null, venue: stadiumFor(11), events: [], broadcastChannels: ["beIN Sports", "ESPN", "Supersport"] },
    { id: "m13", homeTeamId: "belgium", awayTeamId: "new_zealand", date: "2026-06-16", time: "18:00", group: "G", stage: "group", status: "upcoming", homeScore: null, awayScore: null, venue: stadiumFor(12), events: [], broadcastChannels: ["beIN Sports", "RTBF", "Sky Sport"] },
    { id: "m14", homeTeamId: "croatia", awayTeamId: "colombia", date: "2026-06-16", time: "21:00", group: "G", stage: "group", status: "upcoming", homeScore: null, awayScore: null, venue: stadiumFor(13), events: [], broadcastChannels: ["beIN Sports", "HRT", "Caracol"] },
    // Jun 17
    { id: "m15", homeTeamId: "denmark", awayTeamId: "ghana", date: "2026-06-17", time: "15:00", group: "H", stage: "group", status: "upcoming", homeScore: null, awayScore: null, venue: stadiumFor(14), events: [], broadcastChannels: ["beIN Sports", "DR", "GTV"] },
    { id: "m16", homeTeamId: "switzerland", awayTeamId: "chile", date: "2026-06-17", time: "18:00", group: "H", stage: "group", status: "upcoming", homeScore: null, awayScore: null, venue: stadiumFor(15), events: [], broadcastChannels: ["beIN Sports", "SRF", "Chilevision"] },
    // Jun 18 — MD2 begins
    { id: "m17", homeTeamId: "usa", awayTeamId: "ukraine", date: "2026-06-18", time: "15:00", group: "A", stage: "group", status: "upcoming", homeScore: null, awayScore: null, venue: stadiumFor(1), events: [], broadcastChannels: ["beIN Sports", "Fox Sports"] },
    { id: "m18", homeTeamId: "senegal", awayTeamId: "mexico", date: "2026-06-18", time: "20:00", group: "A", stage: "group", status: "upcoming", homeScore: null, awayScore: null, venue: stadiumFor(2), events: [], broadcastChannels: ["beIN Sports", "ESPN"] },
    // Jun 19
    { id: "m19", homeTeamId: "argentina", awayTeamId: "morocco", date: "2026-06-19", time: "15:00", group: "B", stage: "group", status: "upcoming", homeScore: null, awayScore: null, venue: stadiumFor(3), events: [], broadcastChannels: ["beIN Sports", "ESPN"] },
    { id: "m20", homeTeamId: "portugal", awayTeamId: "south_korea", date: "2026-06-19", time: "20:00", group: "B", stage: "group", status: "upcoming", homeScore: null, awayScore: null, venue: stadiumFor(4), events: [], broadcastChannels: ["beIN Sports", "RTP", "SBS"] },
  ];

  return matches;
}

export type MatchSortKey = "date" | "group" | "stage";

export function groupMatchesByDate(matches: Match[]): { date: string; label: string; matches: Match[] }[] {
  const groups = new Map<string, Match[]>();
  for (const m of matches) {
    const existing = groups.get(m.date) ?? [];
    existing.push(m);
    groups.set(m.date, existing);
  }

  const today = "2026-06-15";
  const dateFormatter = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, matchList]) => ({
      date,
      label: date === today ? "Aujourd'hui" : capitalizeFirst(dateFormatter.format(new Date(date))),
      matches: matchList.sort((a, b) => a.time.localeCompare(b.time)),
    }));
}

function capitalizeFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}