export interface Team {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  group: string;
  fifaRank: number;
}

export const TEAMS: Team[] = [
  // Group A
  { id: "usa", name: "United States", shortName: "USA", flag: "🇺🇸", group: "A", fifaRank: 13 },
  { id: "mexico", name: "Mexico", shortName: "MEX", flag: "🇲🇽", group: "A", fifaRank: 14 },
  { id: "senegal", name: "Senegal", shortName: "SEN", flag: "🇸🇳", group: "A", fifaRank: 18 },
  { id: "ukraine", name: "Ukraine", shortName: "UKR", flag: "🇺🇦", group: "A", fifaRank: 24 },
  // Group B
  { id: "argentina", name: "Argentina", shortName: "ARG", flag: "🇦🇷", group: "B", fifaRank: 1 },
  { id: "portugal", name: "Portugal", shortName: "POR", flag: "🇵🇹", group: "B", fifaRank: 6 },
  { id: "morocco", name: "Morocco", shortName: "MAR", flag: "🇲🇦", group: "B", fifaRank: 12 },
  { id: "south_korea", name: "South Korea", shortName: "KOR", flag: "🇰🇷", group: "B", fifaRank: 23 },
  // Group C
  { id: "france", name: "France", shortName: "FRA", flag: "🇫🇷", group: "C", fifaRank: 2 },
  { id: "brazil", name: "Brazil", shortName: "BRA", flag: "🇧🇷", group: "C", fifaRank: 4 },
  { id: "egypt", name: "Egypt", shortName: "EGY", flag: "🇪🇬", group: "C", fifaRank: 33 },
  { id: "australia", name: "Australia", shortName: "AUS", flag: "🇦🇺", group: "C", fifaRank: 27 },
  // Group D
  { id: "england", name: "England", shortName: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "D", fifaRank: 3 },
  { id: "spain", name: "Spain", shortName: "ESP", flag: "🇪🇸", group: "D", fifaRank: 7 },
  { id: "japan", name: "Japan", shortName: "JPN", flag: "🇯🇵", group: "D", fifaRank: 17 },
  { id: "canada", name: "Canada", shortName: "CAN", flag: "🇨🇦", group: "D", fifaRank: 43 },
  // Group E
  { id: "germany", name: "Germany", shortName: "GER", flag: "🇩🇪", group: "E", fifaRank: 11 },
  { id: "netherlands", name: "Netherlands", shortName: "NED", flag: "🇳🇱", group: "E", fifaRank: 8 },
  { id: "ivory_coast", name: "Ivory Coast", shortName: "CIV", flag: "🇨🇮", group: "E", fifaRank: 38 },
  { id: "saudi_arabia", name: "Saudi Arabia", shortName: "KSA", flag: "🇸🇦", group: "E", fifaRank: 56 },
  // Group F
  { id: "italy", name: "Italy", shortName: "ITA", flag: "🇮🇹", group: "F", fifaRank: 9 },
  { id: "uruguay", name: "Uruguay", shortName: "URU", flag: "🇺🇾", group: "F", fifaRank: 15 },
  { id: "nigeria", name: "Nigeria", shortName: "NGA", flag: "🇳🇬", group: "F", fifaRank: 30 },
  { id: "qatar", name: "Qatar", shortName: "QAT", flag: "🇶🇦", group: "F", fifaRank: 50 },
  // Group G
  { id: "belgium", name: "Belgium", shortName: "BEL", flag: "🇧🇪", group: "G", fifaRank: 5 },
  { id: "croatia", name: "Croatia", shortName: "CRO", flag: "🇭🇷", group: "G", fifaRank: 10 },
  { id: "colombia", name: "Colombia", shortName: "COL", flag: "🇨🇴", group: "G", fifaRank: 16 },
  { id: "new_zealand", name: "New Zealand", shortName: "NZL", flag: "🇳🇿", group: "G", fifaRank: 91 },
  // Group H
  { id: "denmark", name: "Denmark", shortName: "DEN", flag: "🇩🇰", group: "H", fifaRank: 19 },
  { id: "switzerland", name: "Switzerland", shortName: "SUI", flag: "🇨🇭", group: "H", fifaRank: 20 },
  { id: "chile", name: "Chile", shortName: "CHI", flag: "🇨🇱", group: "H", fifaRank: 35 },
  { id: "ghana", name: "Ghana", shortName: "GHA", flag: "🇬🇭", group: "H", fifaRank: 60 },
];

export const TEAM_BY_ID: Record<string, Team> = Object.fromEntries(
  TEAMS.map((t) => [t.id, t])
);