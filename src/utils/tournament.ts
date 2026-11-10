import { TournamentMatch, PlayerStats, TournamentState, MatchScore, MatchFormat, PlayerBio } from '../types';

export const STORAGE_KEY = 'hbt-state';

export const PLAYER_COLORS = [
  '#16a34a', // green
  '#2563eb', // blue
  '#d97706', // amber
  '#dc2626', // red
  '#9333ea', // purple
  '#0d9488', // teal
  '#ea580c', // orange
  '#4f46e5', // indigo
  '#db2777', // pink
  '#0284c7', // sky
  '#059669', // emerald
  '#7c3aed', // violet
];

export const PLAY_STYLES = [
  'Jump Smash Attacker',
  'All-Round Tactician',
  'Net Play Specialist',
  'Defensive Retriever',
  'Fast-Paced Speedster',
  'Deceptive Drop-Shotter',
];

export const PRESET_ROSTERS = [
  {
    name: 'Badminton Legends',
    players: [
      'Viktor Axelsen',
      'Lee Chong Wei',
      'Lin Dan',
      'Kento Momota',
      'Anthony Ginting',
      'Shi Yuqi',
    ],
  },
  {
    name: 'Club All-Stars',
    players: ['Hassan', 'Hamza', 'Ali', 'Usman', 'Tariq', 'Bilal'],
  },
  {
    name: 'Top 4 Quick Cup',
    players: ['Alex', 'Brian', 'Charlie', 'David'],
  },
  {
    name: 'Doubles Teams',
    players: [
      'Team Falcons',
      'Team Vipers',
      'Team Titans',
      'Team Phoenix',
      'Team Raptors',
      'Team Cyclones',
    ],
  },
];

export function getPlayerColor(index: number): string {
  return PLAYER_COLORS[index % PLAYER_COLORS.length];
}

export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function getSetsRequiredToWin(format: MatchFormat): number {
  switch (format) {
    case 'bo1':
      return 1;
    case 'bo5':
      return 3;
    case 'bo3':
    default:
      return 2;
  }
}

export function getMaxSets(format: MatchFormat): number {
  switch (format) {
    case 'bo1':
      return 1;
    case 'bo5':
      return 5;
    case 'bo3':
    default:
      return 3;
  }
}

export function getFormatLabel(format: MatchFormat): string {
  switch (format) {
    case 'bo1':
      return 'Best of 1 Set (1 set to win)';
    case 'bo5':
      return 'Best of 5 Sets (First to 3)';
    case 'bo3':
    default:
      return 'Best of 3 Sets (First to 2)';
  }
}

/**
 * Generate round-robin fixtures so every player plays every other player once.
 */
export function generateFixtures(playerCount: number): TournamentMatch[] {
  const matches: TournamentMatch[] = [];
  if (playerCount < 2) return matches;

  let matchCount = 1;
  for (let i = 0; i < playerCount; i++) {
    for (let j = i + 1; j < playerCount; j++) {
      matches.push({
        id: `${i}-${j}`,
        playerAIndex: i,
        playerBIndex: j,
        roundNumber: matchCount++,
      });
    }
  }

  return matches;
}

/**
 * Calculate full standings table including sets and point differentials
 */
export function calculateStandings(
  players: string[],
  results: Record<string, number>,
  scores?: Record<string, MatchScore>,
  playerPhotos?: Record<number, string>,
  playerBios?: Record<number, PlayerBio>
): PlayerStats[] {
  const fixtures = generateFixtures(players.length);

  const stats: PlayerStats[] = players.map((name, i) => ({
    id: i,
    name,
    photo: playerPhotos?.[i],
    avatarColor: getPlayerColor(i),
    played: 0,
    won: 0,
    lost: 0,
    points: 0,
    setsWon: 0,
    setsLost: 0,
    pointsFor: 0,
    pointsAgainst: 0,
    form: [],
    bio: playerBios?.[i] || {
      playStyle: PLAY_STYLES[i % PLAY_STYLES.length],
      hand: i % 3 === 0 ? 'Left' : 'Right',
    },
  }));

  fixtures.forEach((match) => {
    const winner = results[match.id];
    if (winner !== undefined) {
      const a = match.playerAIndex;
      const b = match.playerBIndex;

      stats[a].played++;
      stats[b].played++;

      if (winner === a) {
        stats[a].won++;
        stats[a].points += 2;
        stats[a].form.push('W');

        stats[b].lost++;
        stats[b].form.push('L');
      } else if (winner === b) {
        stats[b].won++;
        stats[b].points += 2;
        stats[b].form.push('W');

        stats[a].lost++;
        stats[a].form.push('L');
      }

      // Check detailed set scores up to 5 sets
      const score = scores?.[match.id];
      if (score) {
        const rawSets: Array<[number | undefined, number | undefined]> = [
          [score.s1a, score.s1b],
          [score.s2a, score.s2b],
          [score.s3a, score.s3b],
          [score.s4a, score.s4b],
          [score.s5a, score.s5b],
        ];

        rawSets.forEach(([sa, sb]) => {
          if (sa === undefined || sb === undefined || (sa === 0 && sb === 0)) return;
          stats[a].pointsFor += sa;
          stats[a].pointsAgainst += sb;
          stats[b].pointsFor += sb;
          stats[b].pointsAgainst += sa;

          if (sa > sb) {
            stats[a].setsWon++;
            stats[b].setsLost++;
          } else if (sb > sa) {
            stats[b].setsWon++;
            stats[a].setsLost++;
          }
        });
      }
    }
  });

  return stats.sort((p1, p2) => {
    if (p2.points !== p1.points) return p2.points - p1.points;
    if (p2.won !== p1.won) return p2.won - p1.won;
    const setDiff2 = p2.setsWon - p2.setsLost;
    const setDiff1 = p1.setsWon - p1.setsLost;
    if (setDiff2 !== setDiff1) return setDiff2 - setDiff1;
    const ptDiff2 = p2.pointsFor - p2.pointsAgainst;
    const ptDiff1 = p1.pointsFor - p1.pointsAgainst;
    if (ptDiff2 !== ptDiff1) return ptDiff2 - ptDiff1;
    return p1.name.localeCompare(p2.name);
  });
}

/**
 * Format match score for display across 1, 3, or 5 sets
 */
export function formatScore(score?: MatchScore): string {
  if (!score) return '';
  const parts: string[] = [];
  if (score.s1a !== undefined && score.s1b !== undefined) parts.push(`${score.s1a}-${score.s1b}`);
  if (score.s2a !== undefined && score.s2b !== undefined) parts.push(`${score.s2a}-${score.s2b}`);
  if (score.s3a !== undefined && score.s3b !== undefined) parts.push(`${score.s3a}-${score.s3b}`);
  if (score.s4a !== undefined && score.s4b !== undefined) parts.push(`${score.s4a}-${score.s4b}`);
  if (score.s5a !== undefined && score.s5b !== undefined) parts.push(`${score.s5a}-${score.s5b}`);
  return parts.join(', ');
}

/**
 * Save tournament state to localStorage matching the original Android app key
 */
export function saveTournamentState(state: TournamentState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save tournament state:', err);
  }
}

/**
 * Load tournament state from localStorage with fallback defaults
 */
export function loadTournamentState(): TournamentState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.players) && parsed.players.length >= 2) {
        return {
          players: parsed.players,
          playerPhotos: parsed.playerPhotos || {},
          playerBios: parsed.playerBios || {},
          matchFormat: parsed.matchFormat || 'bo3',
          results: parsed.results || {},
          scores: parsed.scores || {},
          semis: parsed.semis || {},
          semiScores: parsed.semiScores || {},
          thirdPlaceWinner: parsed.thirdPlaceWinner ?? null,
          thirdPlaceScore: parsed.thirdPlaceScore,
          finalWinner: parsed.finalWinner ?? null,
          finalScore: parsed.finalScore,
          started: Boolean(parsed.started),
          tournamentTitle: parsed.tournamentTitle || 'Smash Championship',
          createdDate: parsed.createdDate || new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.error('Failed to load tournament state:', err);
  }

  return {
    players: ['Player 1', 'Player 2', 'Player 3', 'Player 4', 'Player 5', 'Player 6'],
    playerPhotos: {},
    playerBios: {},
    matchFormat: 'bo3',
    results: {},
    scores: {},
    semis: {},
    semiScores: {},
    thirdPlaceWinner: null,
    finalWinner: null,
    started: false,
    tournamentTitle: 'Smash Championship',
    createdDate: new Date().toISOString(),
  };
}
