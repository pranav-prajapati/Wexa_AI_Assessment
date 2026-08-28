import { NextRequest, NextResponse } from "next/server";
import { driver } from "@/lib/db";

type JobResult = {
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skillsParam = searchParams.get("skills");

  if (!skillsParam) {
    return NextResponse.json(
      { error: "At least one skill is required" },
      { status: 400 },
    );
  }

  const skills = skillsParam
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  if (skills.length === 0) {
    return NextResponse.json(
      { error: "At least one skill is required" },
      { status: 400 },
    );
  }

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (company:Company)-[:POSTED]->(job:Job)
      MATCH (job)-[:REQUIRES]->(skill:Skill)
      WITH company, job, collect(skill.name) AS requiredSkills
      WITH
        company,
        job,
        requiredSkills,
        [skill IN requiredSkills WHERE skill IN $skills] AS matchedSkills
      WHERE size(matchedSkills) > 0
      RETURN
        job,
        company,
        requiredSkills,
        matchedSkills
      ORDER BY job.title
      `,
      { skills },
    );

    const jobs: JobResult[] = result.records.map((record) => {
      const job = record.get("job");
      const company = record.get("company");

      const requiredSkills = record.get("requiredSkills") as string[];
      const matchedSkills = record.get("matchedSkills") as string[];

      const matchPercentage = Math.round(
        (matchedSkills.length / requiredSkills.length) * 100,
      );

      const missingSkills = requiredSkills.filter(
        (skill) => !matchedSkills.includes(skill),
      );

      return {
        id: job.elementId,
        title: job.properties.title,
        location: job.properties.location,
        workMode: job.properties.workMode,
        experience: job.properties.experience,
        company: company.properties.name,
        requiredSkills,
        matchedSkills,
        missingSkills,
        matchPercentage,
      };
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);

    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  } finally {
    await session.close();
  }
}
