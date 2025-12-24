// Top 20 hackathon skills in India
export const SKILLS = [
  'Frontend',
  'Backend',
  'Full Stack',
  'UI/UX Design',
  'Mobile Dev',
  'DevOps',
  'ML/AI',
  'Data Science',
  'Blockchain',
  'Cybersecurity',
  'Game Dev',
  'AR/VR',
  'Cloud',
  'Testing/QA',
  'Product Management',
  'Content Writing',
  'Marketing',
  'Video Editing',
  '3D Design',
  'Business/Strategy',
] as const;

export const ROLES = [
  'Developer',
  'Designer',
  'Product Manager',
  'Data Scientist',
  'DevOps Engineer',
  'Marketing',
  'Other',
] as const;

export const TIME_AVAILABILITY = ['full-time', 'partial'] as const;
export const GOALS = ['win', 'learn', 'build'] as const;
export const TEAM_STATES = ['DRAFT', 'OPEN', 'FINALIZED', 'LOCKED'] as const;

export type Skill = typeof SKILLS[number];
export type Role = typeof ROLES[number];
export type TimeAvailability = typeof TIME_AVAILABILITY[number];
export type Goal = typeof GOALS[number];
export type TeamState = typeof TEAM_STATES[number];
