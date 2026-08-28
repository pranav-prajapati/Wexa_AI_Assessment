import { NextRequest, NextResponse } from "next/server";
import { driver } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = driver.session();

  try {
    const result = await session.run(
      `
      MATCH (company:Company)-[:POSTED]->(job:Job)
      WHERE elementId(job) = $id

      OPTIONAL MATCH (job)-[:REQUIRES]->(skill:Skill)

      RETURN
        job,
        company,
        collect(skill.name) AS requiredSkills
      `,
      { id },
    );

    if (result.records.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const record = result.records[0];

    const job = record.get("job");
    const company = record.get("company");
    const requiredSkills = record.get("requiredSkills");

    return NextResponse.json({
      id: job.elementId,
      title: job.properties.title,
      location: job.properties.location,
      workMode: job.properties.workMode,
      experience: job.properties.experience,
      company: company.properties.name,
      requiredSkills,
    });
  } catch (error) {
    console.error("Failed to fetch job:", error);

    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  } finally {
    await session.close();
  }
}
