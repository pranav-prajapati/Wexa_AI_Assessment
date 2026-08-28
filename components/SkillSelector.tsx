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
    <section className="rounded-2xl border border-border bg-surface p-6">
      <div>
        <h2 className="text-lg font-semibold">Your skills</h2>

        <p className="mt-1 text-sm text-foreground-muted">
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
                ? "border-primary bg-primary-soft text-primary-light"
                : "border-border text-foreground-secondary hover:border-primary/50"
                }`}
            >
              {skill}
            </button>
          );
        })}
      </div>
      {selectedSkills.length > 0 && (
        <p className="mt-4 text-sm text-foreground-muted">
          {selectedSkills.length}{" "}
          {selectedSkills.length === 1 ? "skill" : "skills"} selected
        </p>
      )}
    </section>
  );
}
