"use client";

import { useEffect, useState } from "react";
import type { SkillGraphPath } from "@/types/job";
import { API_ROUTES } from "@/constants/config";

type SkillGraphProps = {
  selectedSkills: string[];
};

export default function SkillGraph({ selectedSkills }: SkillGraphProps) {
  const [skillPaths, setSkillPaths] = useState<SkillGraphPath[]>([]);
  const [graphLoading, setGraphLoading] = useState(false);
  const [exploredSkill, setExploredSkill] = useState<string | null>(null);

  useEffect(() => {
    if (exploredSkill && !selectedSkills.includes(exploredSkill)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting local state when a prop no longer supports it
      setExploredSkill(null);
    }
  }, [exploredSkill, selectedSkills]);

  async function exploreSkill(skill: string) {
    setExploredSkill(skill);
    setGraphLoading(true);

    try {
      const response = await fetch(
        `${API_ROUTES.graph}?skill=${encodeURIComponent(skill)}`
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
    <section className="mt-12 rounded-2xl border border-border bg-surface p-6">
      <div>
        <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
          SkillGraph
        </p>

        <h2 className="mt-1 text-2xl font-semibold">
          Explore skill connections
        </h2>

        <p className="mt-2 text-sm text-foreground-secondary">
          Discover skills connected to what you already know.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {selectedSkills.map((skill) => {
          const isActive = exploredSkill === skill;

          return (
            <button
              key={skill}
              onClick={() => exploreSkill(skill)}
              className={`rounded-xl border px-4 py-2 text-sm transition ${isActive
                ? "border-primary bg-primary-soft text-primary-light"
                : "border-border text-foreground-secondary hover:border-primary hover:text-primary-light"
                }`}
            >
              {isActive ? `${skill}` : `Explore ${skill}`}
            </button>
          );
        })}
      </div>
      {selectedSkills.length === 0 && (
        <p className="mt-6 text-sm text-foreground-muted">
          Select a skill above to explore its connections.
        </p>
      )}
      {graphLoading && selectedSkills.length > 0 && (
        <p className="mt-6 text-sm text-foreground-muted">
          Exploring connections...
        </p>
      )}

      {!graphLoading && selectedSkills.length > 0 && skillPaths.length > 0 && (
        <div className="mt-6">
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground-secondary">
              Two-hop skill connections
            </p>

            <p className="mt-1 text-xs text-foreground-faint">
              Skills connected through one intermediate skill.
            </p>
          </div>

          <div className="space-y-3">
            {skillPaths.map((path, index) => (
              <div
                key={`${path.join("-")}-${index}`}
                className="rounded-xl border border-border bg-background px-4 py-3 transition hover:border-primary/30"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {path.map((skill, skillIndex) => (
                    <div key={`${skill}-${skillIndex}`} className="flex items-center gap-2">
                      <span className="rounded-full border border-primary/20 bg-primary-soft/40 px-3 py-1 text-primary-light">
                        {skill}
                      </span>

                      {skillIndex < path.length - 1 && (
                        <span className="text-foreground-faint">→</span>
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
          <p className="mt-6 text-sm text-foreground-muted">
            No skill connections found for the selected skill.
          </p>
        )}
    </section>
  );
}
