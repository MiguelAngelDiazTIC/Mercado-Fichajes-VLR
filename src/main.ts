export type PlayerStatus = 'confirmed' | 'likely' | 'possible' | 'rumor' | 'benched' | 'out';

export interface Player {
  status: PlayerStatus;
  name: string;
  flag: string;
  role?: string;
  photoUrl?: string | null;
  igl?: boolean;
}

export interface StaffMember {
  role: string;
  name: string;
  flag?: string;
  photoUrl?: string | null;
}

export interface Team {
  flag: string;
  name: string;
  players: Player[];
  staff?: StaffMember[];
  logoUrl?: string | null;
  note?: string | null;
}

export interface Region {
  id: string;
  label: string;
  subtitle: string;
  accent: string;
  teams: Team[];
}

export async function loadRegions(): Promise<Region[]> {
  // JSON estáticos publicados por Vite desde public/data/
  const baseUrl = import.meta.env.BASE_URL + 'data/'
  const files = [
    baseUrl + 'teamsEmea.json',
    baseUrl + 'teamsAmer.json',
    baseUrl + 'teamsPACF.json',
    baseUrl + 'teamsCN.json',
  ]
  const responses = await Promise.all(files.map((f) => fetch(f)))
  const failed = responses.find((r) => !r.ok)
  if (failed) throw new Error(`API ${failed.status} en ${failed.url}`)
  const jsons = await Promise.all(responses.map((r) => r.json()))
  return ([] as Region[]).concat(...jsons)
}
