import { NextRequest, NextResponse } from "next/server";
import { driver } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const skillName = searchParams.get("skill");

  if (!skillName) {
    return NextResponse.json({ error: "A skill is required" }, { status: 400 });
  }

  const session = driver.session();

  try {
    const result = await session.run(
      `
  MATCH path =
    (start:Skill {name: $skillName})
    -[:RELATED_TO]-
    (middle:Skill)
    -[:RELATED_TO]-
    (connected:Skill)

  WHERE start <> middle
    AND middle <> connected
    AND start <> connected

  RETURN DISTINCT
    [node IN nodes(path) | node.name] AS path

  LIMIT 6
  `,
      { skillName },
    );
    const paths: string[][] = result.records.map((record) => {
      return record.get("path") as string[];
    });

    return NextResponse.json({
      skill: skillName,
      paths,
    });
  } catch (error) {
    console.error("Failed to fetch skill connections:", error);

    return NextResponse.json(
      { error: "Failed to fetch skill connections" },
      { status: 500 },
    );
  } finally {
    await session.close();
  }
}
