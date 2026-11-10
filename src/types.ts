export type MatchFormat = 'bo1' | 'bo3' | 'bo5';

export interface MatchScore {
  s1a?: number;
  s1b?: number;
  s2a?: number;
  s2b?: number;
  s3a?: number;
  s3b?: number;
  s4a?: number;
  s4b?: number;
  s5a?: number;
  s5b?: number;
}

export interface PlayerBio {
  playStyle?: string;
  hand?: 'Right' | 'Left';
  racket?: string;
  notes?: string;
}

export interface PlayerStats {
  id: number;
  name: string;
  photo?: string;
  avatarColor: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  setsWon: number;
  setsLost: number;
  pointsFor: number;
  pointsAgainst: number;
  form: ('W' | 'L')[];
  bio?: PlayerBio;
}

export interface TournamentMatch {
  id: string; // e.g. "0-1"
  playerAIndex: number;
  playerBIndex: number;
  roundNumber?: number;
  score?: MatchScore;
  courtNumber?: number;
}

export interface ShuttleEquipment {
  type: 'feather' | 'nylon';
  brand: string;
  speed: 76 | 77 | 78;
  shuttlesUsed: number;
}

export interface LivePointHistory {
  player: 'A' | 'B';
  scoreA: number;
  scoreB: number;
  server: 'A' | 'B';
  timestamp: number;
}

export interface LiveMatchState {
  matchId: string;
  playerAIndex: number;
  playerBIndex: number;
  currentSet: number;
  setScores: Array<{ a: number; b: number }>;
  currentPointsA: number;
  currentPointsB: number;
  server: 'A' | 'B';
  servingSide: 'right' | 'left';
  sideAOnLeft: boolean;
  history: LivePointHistory[];
  courtNumber: number;
  equipment: ShuttleEquipment;
  status: 'warmup' | 'in_progress' | 'interval' | 'set_break' | 'finished';
  intervalRemainingSeconds?: number;
}

export interface TournamentState {
  players: string[];
  playerPhotos?: Record<number, string>;
  playerBios?: Record<number, PlayerBio>;
  matchFormat: MatchFormat;
  results: Record<string, number>;
  scores?: Record<string, MatchScore>;
  semis: Record<number, number>;
  semiScores?: Record<number, MatchScore>;
  thirdPlaceWinner?: number | null;
  thirdPlaceScore?: MatchScore;
  finalWinner: number | null;
  finalScore?: MatchScore;
  started: boolean;
  tournamentTitle: string;
  createdDate: string;
  shuttleEquipment?: ShuttleEquipment;
}
