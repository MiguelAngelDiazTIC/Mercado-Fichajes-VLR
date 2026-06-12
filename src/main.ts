export type PlayerStatus = 'confirmed' | 'likely' | 'possible' | 'rumor' | 'benched' | 'out';

export interface Player {
  status: PlayerStatus;
  name: string;
  flag: string;
  role?: string;
}

export interface StaffMember {
  role: string;
  name: string;
  flag?: string;
}

export interface Team {
  flag: string;
  name: string;
  players: Player[];
  staff?: StaffMember[];
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
  const baseUrl = 'https://mercado-fichajes-vlr-production.up.railway.app'
  const files = [
    baseUrl + '/api/teams/teamsEmea',
    baseUrl + '/api/teams/teamsAmer',
    baseUrl + '/api/teams/teamsPACF',
    baseUrl + '/api/teams/teamsCN',
  ]
  const responses = await Promise.all(files.map((f) => fetch(f)))
  const jsons = await Promise.all(responses.map((r) => r.json()))
  return ([] as Region[]).concat(...jsons)
}
