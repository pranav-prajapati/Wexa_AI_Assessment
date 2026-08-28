import Link from "next/link";
import type { Job } from "@/types/job";

type JobCardProps = {
  job: Job;
  selectedSkills: string[];
};

export default function JobCard({ job, selectedSkills }: JobCardProps) {
  return (
    <Link
      href={`/jobs/${job.id}?skills=${encodeURIComponent(
        selectedSkills.join(",")
      )}`}
      className="group block rounded-2xl border border-border bg-surface-secondary p-6 transition hover:border-primary/40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold transition group-hover:text-primary-light">
            {job.title}
          </h3>

          <p className="mt-1 text-foreground-secondary">{job.company}</p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold tracking-tight text-success">
            {job.matchPercentage}%
          </div>

          <div className="text-xs text-foreground-muted">match</div>
        </div>
      </div>

      <p className="mt-3 text-sm text-foreground-muted">
        {job.location} · {job.experience}
      </p>

      <div className="mt-4 rounded-xl bg-surface p-4">
        <div className="flex flex-wrap gap-2">
          {job.matchedSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-success/10 px-3 py-1 text-xs text-success"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs text-foreground-muted">
            <span>
              {job.matchedSkills.length} of {job.requiredSkills.length} skills matched
            </span>

            <span>{job.matchPercentage}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-surface-secondary">
            <div
              className="h-full rounded-full bg-success"
              style={{ width: `${job.matchPercentage}%` }}
            />
          </div>
        </div>

        {job.missingSkills.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Missing skills
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {job.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-surface-secondary px-3 py-1 text-xs text-foreground-muted"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 text-sm font-medium text-primary transition group-hover:text-primary-light">
        View job details →
      </div>
    </Link>
  );
}
