"use client";

import Link from "next/link";
import { useState } from "react";

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

type Job = {
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

export default function Home() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [skillPaths, setSkillPaths] = useState<string[][]>([]);
  const [graphLoading, setGraphLoading] = useState(false);

  async function exploreSkill(skill: string) {
    setGraphLoading(true);

    try {
      const response = await fetch(
        `/api/graph?skill=${encodeURIComponent(skill)}`
      );

      const data = await response.json();

      setSkillPaths(data.paths ?? []);
    } catch (error) {
      console.error("Failed to fetch skill connections:", error);
    } finally {
      setGraphLoading(false);
    }
  }

  function toggleSkill(skill: string) {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill]
    );
  }

  async function findJobs() {
    if (selectedSkills.length === 0) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/jobs?skills=${encodeURIComponent(selectedSkills.join(","))}`
      );

      const data = await response.json();

      setJobs(data.jobs ?? []);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
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

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-lg font-semibold">Your skills</h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {availableSkills.map((skill) => {
              const selected = selectedSkills.includes(skill);

              return (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${selected
                    ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                    }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>

          <button
            onClick={findJobs}
            disabled={selectedSkills.length === 0 || loading}
            className="mt-6 rounded-xl bg-white px-5 py-3 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Finding jobs..." : "Find matching jobs"}
          </button>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Recommended jobs</h2>

            {jobs.length > 0 && (
              <span className="text-sm text-zinc-500">
                {jobs.length} opportunities
              </span>
            )}
          </div>

          {jobs.length === 0 && !loading && (
            <div className="rounded-2xl border border-dashed border-zinc-800 p-10 text-center">
              <p className="text-zinc-400">
                Select your skills to discover matching opportunities.
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}?skills=${encodeURIComponent(
                  selectedSkills.join(",")
                )}`}
                className="block rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-600 hover:bg-zinc-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{job.title}</h3>

                    <p className="mt-1 text-zinc-400">{job.company}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-300">
                      {job.matchPercentage}%
                    </div>

                    <div className="text-xs text-zinc-500">match</div>
                  </div>
                </div>

                <p className="mt-4 text-sm text-zinc-500">
                  {job.location} · {job.experience}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {job.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Add the match bar HERE */}
                <div className="mt-5">
                  <div className="mb-2 flex justify-between text-xs text-zinc-500">
                    <span>
                      {job.matchedSkills.length} of {job.requiredSkills.length} skills matched
                    </span>

                    <span>{job.matchPercentage}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-cyan-400"
                      style={{ width: `${job.matchPercentage}%` }}
                    />
                  </div>
                </div>
                {job.missingSkills.length > 0 && (
                  <div className="mt-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Missing skills
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 text-sm font-medium text-cyan-400">
                      View job details →
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <p className="text-sm font-medium text-cyan-400">
              Skill graph
            </p>

            <h2 className="mt-1 text-2xl font-semibold">
              Explore skill connections
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Discover skills connected to what you already know.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {selectedSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => exploreSkill(skill)}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                Explore {skill}
              </button>
            ))}
          </div>

          {graphLoading && (
            <p className="mt-6 text-sm text-zinc-500">
              Exploring connections...
            </p>
          )}

          {!graphLoading && skillPaths.length > 0 && (
            <div className="mt-6">
              <p className="mb-3 text-sm text-zinc-500">
                Two-hop skill connections
              </p>

              <div className="space-y-3">
                {skillPaths.map((path, index) => (
                  <div
                    key={`${path.join("-")}-${index}`}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      {path.map((skill, skillIndex) => (
                        <div key={`${skill}-${skillIndex}`} className="flex items-center gap-2">
                          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300">
                            {skill}
                          </span>

                          {skillIndex < path.length - 1 && (
                            <span className="text-zinc-600">→</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}