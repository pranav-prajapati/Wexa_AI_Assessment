type SkillSelectorProps = {
  availableSkills: string[];
  selectedSkills: string[];
  onToggleSkill: (skill: string) => void;
};

export default function SkillSelector({
  availableSkills,
  selectedSkills,
  onToggleSkill,
}: SkillSelectorProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <div>
        <h2 className="text-lg font-semibold">Your skills</h2>

        <p className="mt-1 text-sm text-zinc-500">
          Select the skills you currently have.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {availableSkills.map((skill) => {
          const selected = selectedSkills.includes(skill);

          return (
            <button
              key={skill}
              onClick={() => onToggleSkill(skill)}
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
      {selectedSkills.length > 0 && (
        <p className="mt-4 text-sm text-zinc-500">
          {selectedSkills.length}{" "}
          {selectedSkills.length === 1 ? "skill" : "skills"} selected
        </p>
      )}
    </section>
  );
}
