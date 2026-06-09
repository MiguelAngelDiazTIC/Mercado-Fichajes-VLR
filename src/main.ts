export interface Player {
  status: "confirmed" | "likely" | "possible" | "rumor";
  name: string;
  flag: string;
  role: string;
}
export interface Team {
  flag: string;
  name: string;
  players: Player[];
  note?: string;
}
export interface Region {
  id: string;
  label: string;
  subtitle: string;
  accent: string;
  teams: Team[];
}

export async function loadRegions(): Promise<Region[]> {
  const files = [
    '../data/teamsEmea.json',
    '../data/teamsAmer.json',
    '../data/teamsPACF.json',
    '../data/teamsCN.json',
  ];

  const responses = await Promise.all(files.map((f) => fetch(f)));
  const jsons = await Promise.all(responses.map((r) => r.json()));
  return ([] as Region[]).concat(...jsons);
}
