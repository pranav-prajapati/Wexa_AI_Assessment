"use client";

import { useState } from "react";
import type { SkillGraphPath } from "@/types/job";

type SkillGraphProps = {
  selectedSkills: string[];
};

export default function SkillGraph({ selectedSkills }: SkillGraphProps) {
  const [skillPaths, setSkillPaths] = useState<SkillGraphPath[]>([]);
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

  return (
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
      {selectedSkills.length === 0 && (
        <p className="mt-6 text-sm text-zinc-500">
          Select a skill above to explore its connections.
        </p>
      )}
      {graphLoading && (
        <p className="mt-6 text-sm text-zinc-500">
          Exploring connections...
        </p>
      )}

      {!graphLoading && skillPaths.length > 0 && (
        <div className="mt-6">
          <div className="mb-4">
            <p className="text-sm font-medium text-zinc-300">
              Two-hop skill connections
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Skills connected through one intermediate skill.
            </p>
          </div>

          <div className="space-y-3">
            {skillPaths.map((path, index) => (
              <div
                key={`${path.join("-")}-${index}`}
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 transition hover:border-zinc-700"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {path.map((skill, skillIndex) => (
                    <div key={`${skill}-${skillIndex}`} className="flex items-center gap-2">
                      <span className="rounded-full border border-cyan-400/10 bg-cyan-400/5 px-3 py-1 text-cyan-300">
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
      {!graphLoading &&
        selectedSkills.length > 0 &&
        skillPaths.length === 0 && (
          <p className="mt-6 text-sm text-zinc-500">
            No skill connections found for the selected skill.
          </p>
        )}
    </section>
  );
}
