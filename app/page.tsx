"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SkillSelector from "@/components/SkillSelector";
import JobCard from "@/components/JobCard";
import SkillGraph from "@/components/SkillGraph";
import type { Job } from "@/types/job";

const availableSkills = [
  "React",
  "TypeScript",
  "JavaScript",
  "Next.js",
  "Node.js",
  "GraphQL",
  "CSS",
  "Jest",
];

function parseSkills(skillsParam: string | null): string[] {
  return skillsParam
    ? skillsParam
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
    : [];
}

function HomeContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedSkills, setSelectedSkills] = useState<string[]>(() =>
    parseSkills(searchParams.get("skills"))
  );
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  // Ignore stale responses if skills change again before this resolves.
  const latestRequestIdRef = useRef(0);

  const findJobs = useCallback(async (skills: string[]) => {
    if (skills.length === 0) return;

    const requestId = ++latestRequestIdRef.current;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/jobs?skills=${encodeURIComponent(skills.join(","))}`
      );

      const data = await response.json();

      if (requestId === latestRequestIdRef.current) {
        setJobs(data.jobs ?? []);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      if (requestId === latestRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Avoid re-fetching when the URL changes because of our own toggle.
  const syncedSkillsParamRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const skillsParam = searchParams.get("skills");

    if (skillsParam === syncedSkillsParamRef.current) return;

    syncedSkillsParamRef.current = skillsParam;

    const urlSkills = parseSkills(skillsParam);

    setSelectedSkills(urlSkills);

    if (urlSkills.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring results for skills already present in the URL
      findJobs(urlSkills);
    }
  }, [searchParams, findJobs]);

  function toggleSkill(skill: string) {
    const next = selectedSkills.includes(skill)
      ? selectedSkills.filter((item) => item !== skill)
      : [...selectedSkills, skill];

    setSelectedSkills(next);

    const params = new URLSearchParams(searchParams.toString());

    if (next.length > 0) {
      params.set("skills", next.join(","));
    } else {
      params.delete("skills");
    }

    // Mark it handled before the URL actually changes, so the effect above skips it.
    syncedSkillsParamRef.current = next.length > 0 ? next.join(",") : null;

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });

    if (next.length > 0) {
      findJobs(next);
    } else {
      latestRequestIdRef.current += 1;
      setJobs([]);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12">
          <p className="mb-3 text-sm font-medium text-cyan-400">
            SkillGraph
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Find opportunities through your skills.
          </h1>

          <p className="mt-4 max-w-2xl text-zinc-400">
            Select the skills you know and explore jobs connected through the
            skill graph.
          </p>
        </div>

        <SkillSelector
          availableSkills={availableSkills}
          selectedSkills={selectedSkills}
          onToggleSkill={toggleSkill}
        />

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recommended jobs</h2>

            {loading ? (
              <span className="text-sm text-zinc-500">Finding jobs...</span>
            ) : (
              jobs.length > 0 && (
                <span className="text-sm text-zinc-500">
                  {jobs.length} opportunities
                </span>
              )
            )}
          </div>

          {jobs.length === 0 && !loading && (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/10 text-xl text-cyan-300">
                ✦
              </div>

              <h3 className="mt-4 text-lg font-semibold">
                Discover your next opportunity
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Select the skills you know above and we&apos;ll find jobs that
                match your current skill set.
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} selectedSkills={selectedSkills} />
            ))}
          </div>
        </section>

        <SkillGraph selectedSkills={selectedSkills} />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
