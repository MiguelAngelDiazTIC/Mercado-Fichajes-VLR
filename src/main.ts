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
  // En dev se usa el proxy de Vite (ruta relativa); en build, VITE_API_URL o Railway
  const baseUrl = import.meta.env.DEV
    ? ''
    : (import.meta.env.VITE_API_URL ?? 'https://mercado-fichajes-vlr-production.up.railway.app')
  const files = [
    baseUrl + '/api/teams/teamsEmea',
    baseUrl + '/api/teams/teamsAmer',
    baseUrl + '/api/teams/teamsPACF',
    baseUrl + '/api/teams/teamsCN',
  ]
  const responses = await Promise.all(files.map((f) => fetch(f)))
  const failed = responses.find((r) => !r.ok)
  if (failed) throw new Error(`API ${failed.status} en ${failed.url}`)
  const jsons = await Promise.all(responses.map((r) => r.json()))
  return ([] as Region[]).concat(...jsons)
}
