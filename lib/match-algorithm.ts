import { SKILLS } from './constants';

export interface MatchScore {
  teamId: string;
  score: number;
  exactPrimaryMatches: string[];
  exactSecondaryMatches: string[];
  fuzzyMatches: string[];
}

// Fuzzy skill mappings - skills that relate to each other
const FUZZY_SKILL_MAP: Record<string, string[]> = {
  'Full Stack': ['Frontend', 'Backend'],
  'Frontend': ['Full Stack'],
  'Backend': ['Full Stack'],
  'ML/AI': ['Data Science'],
  'Data Science': ['ML/AI'],
  'UI/UX Design': ['Frontend', '3D Design'],
  'Mobile Dev': ['Frontend'],
  'DevOps': ['Cloud', 'Backend'],
  'Cloud': ['DevOps'],
  'Game Dev': ['3D Design', 'AR/VR'],
  'AR/VR': ['Game Dev', '3D Design'],
  '3D Design': ['Game Dev', 'AR/VR', 'UI/UX Design'],
  'Product Management': ['Business/Strategy'],
  'Business/Strategy': ['Product Management'],
  'Marketing': ['Content Writing'],
  'Content Writing': ['Marketing'],
};

/**
 * Calculate match score between user skills and team's needed skills
 * Scoring:
 * - Exact primary skill match: 100 points
 * - Exact secondary skill match: 50 points
 * - Fuzzy match (related skill): 25 points
 */
export function calculateMatchScore(
  userPrimarySkills: string[],
  userSecondarySkills: string[],
  teamNeededSkills: string[]
): {
  score: number;
  exactPrimaryMatches: string[];
  exactSecondaryMatches: string[];
  fuzzyMatches: string[];
} {
  let score = 0;
  const exactPrimaryMatches: string[] = [];
  const exactSecondaryMatches: string[] = [];
  const fuzzyMatches: string[] = [];

  for (const neededSkill of teamNeededSkills) {
    // Check exact primary skill matches (highest priority)
    if (userPrimarySkills.includes(neededSkill)) {
      score += 100;
      exactPrimaryMatches.push(neededSkill);
      continue; // Don't count this skill again
    }

    // Check exact secondary skill matches
    if (userSecondarySkills.includes(neededSkill)) {
      score += 50;
      exactSecondaryMatches.push(neededSkill);
      continue;
    }

    // Check fuzzy matches - see if user has related skills
    const relatedSkills = FUZZY_SKILL_MAP[neededSkill] || [];
    const userHasRelated = userPrimarySkills.some(skill => 
      relatedSkills.includes(skill)
    );
    
    if (userHasRelated) {
      score += 25;
      fuzzyMatches.push(neededSkill);
    }
  }

  return {
    score,
    exactPrimaryMatches,
    exactSecondaryMatches,
    fuzzyMatches,
  };
}

/**
 * Get top N matching teams for a user
 */
export function getTopMatches(
  userPrimarySkills: string[],
  userSecondarySkills: string[],
  teams: any[],
  topN: number = 3
): MatchScore[] {
  const scores: MatchScore[] = teams.map(team => {
    const matchResult = calculateMatchScore(
      userPrimarySkills,
      userSecondarySkills,
      team.skillsNeeded || []
    );

    return {
      teamId: team.id,
      ...matchResult,
    };
  });

  // Sort by score descending, return top N
  return scores
    .filter(s => s.score > 0) // Only teams with some match
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/**
 * Calculate skill coverage percentage for a team
 * Returns percentage of needed skills that are covered by current members
 */
export function calculateSkillCoverage(
  teamNeededSkills: string[],
  memberSkills: string[][]
): number {
  if (teamNeededSkills.length === 0) return 100;

  const coveredSkills = new Set<string>();
  
  for (const neededSkill of teamNeededSkills) {
    for (const skills of memberSkills) {
      if (skills.includes(neededSkill)) {
        coveredSkills.add(neededSkill);
        break;
      }
    }
  }

  return Math.round((coveredSkills.size / teamNeededSkills.length) * 100);
}

/**
 * Get missing skills for a team
 */
export function getMissingSkills(
  teamNeededSkills: string[],
  memberSkills: string[][]
): string[] {
  const coveredSkills = new Set<string>();
  
  for (const neededSkill of teamNeededSkills) {
    for (const skills of memberSkills) {
      if (skills.includes(neededSkill)) {
        coveredSkills.add(neededSkill);
        break;
      }
    }
  }

  return teamNeededSkills.filter(skill => !coveredSkills.has(skill));
}
