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
      className="group block rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition hover:border-zinc-600 hover:bg-zinc-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold transition group-hover:text-cyan-300">
            {job.title}
          </h3>

          <p className="mt-1 text-zinc-400">{job.company}</p>
        </div>

        <div className="text-right">
          <div className="text-3xl font-bold tracking-tight text-cyan-300">
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
        </div>
      )}
      <div className="mt-6 text-sm font-medium text-cyan-400 transition group-hover:text-cyan-300">
        View job details →
      </div>
    </Link>
  );
}
