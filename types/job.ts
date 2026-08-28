export type Job = {
  id: string;
  title: string;
  location: string;
  workMode: string;
  experience: string;
  company: string;
  requiredSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
};

export type JobDetail = Pick<
  Job,
  | "id"
  | "title"
  | "location"
  | "workMode"
  | "experience"
  | "company"
  | "requiredSkills"
>;

export type SkillGraphPath = string[];

export type SkillGraphResponse = {
  skill: string;
  paths: SkillGraphPath[];
};
