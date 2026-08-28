import Link from "next/link";
import type { JobDetail, SkillGraphResponse } from "@/types/job";
import { API_BASE_URL, API_ROUTES } from "@/constants/config";

async function getJob(id: string): Promise<JobDetail> {
    const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.jobs}/${id}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch job");
    }

    return response.json();
}

async function getSkillGraph(skill: string): Promise<SkillGraphResponse> {
    const response = await fetch(
        `${API_BASE_URL}${API_ROUTES.graph}?skill=${encodeURIComponent(skill)}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch skill graph");
    }

    return response.json();
}

export default async function JobDetailsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ skills?: string }>;
}) {
    const { id } = await params;
    const { skills: skillsParam } = await searchParams;

    const selectedSkills = skillsParam
        ? skillsParam
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [];
    const backHref =
        selectedSkills.length > 0
            ? `/?skills=${encodeURIComponent(selectedSkills.join(","))}`
            : "/";
    const job = await getJob(id);
    const matchedSkills = job.requiredSkills.filter((skill) =>
        selectedSkills.includes(skill)
    );

    const missingSkills = job.requiredSkills.filter(
        (skill) => !selectedSkills.includes(skill)
    );

    const matchPercentage =
        job.requiredSkills.length > 0
            ? Math.round(
                (matchedSkills.length / job.requiredSkills.length) * 100
            )
            : 0;
    const graph = job.requiredSkills.length
        ? await getSkillGraph(job.requiredSkills[0])
        : { skill: "", paths: [] };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <div className="mx-auto max-w-4xl px-6 py-16">
                <Link
                    href={backHref}
                    className="text-sm text-foreground-muted hover:text-foreground"
                >
                    ← Back to jobs
                </Link>

                <div className="mt-8 rounded-2xl border border-border bg-surface-secondary p-8">
                    <p className="text-sm font-medium text-foreground-secondary">
                        {job.company}
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        {job.title}
                    </h1>

                    <p className="mt-4 text-foreground-secondary">
                        {job.location} · {job.workMode} · {job.experience}
                    </p>
                    {selectedSkills.length > 0 && (
                        <div className="mt-8 rounded-xl border border-border bg-surface p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-foreground-muted">
                                        Your skill match
                                    </p>

                                    <p className="mt-1 text-3xl font-bold text-success">
                                        {matchPercentage}%
                                    </p>
                                </div>

                                <p className="text-sm text-foreground-muted">
                                    {matchedSkills.length} of {job.requiredSkills.length} skills
                                </p>
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-secondary">
                                <div
                                    className="h-full rounded-full bg-success"
                                    style={{ width: `${matchPercentage}%` }}
                                />
                            </div>
                        </div>
                    )}
                    <div className="mt-10">
                        <h2 className="text-xl font-semibold">
                            Required skills
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {job.requiredSkills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-full bg-surface px-3 py-1.5 text-sm text-foreground-secondary"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    {selectedSkills.length > 0 && (
                        <div className="mt-8 grid gap-6 sm:grid-cols-2">
                            <div>
                                <h3 className="text-sm font-medium text-foreground-muted">
                                    You have
                                </h3>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {matchedSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-full bg-success/10 px-3 py-1.5 text-sm text-success"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-foreground-muted">
                                    Skills to develop
                                </h3>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {missingSkills.length > 0 ? (
                                        missingSkills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-surface px-3 py-1.5 text-sm text-foreground-muted"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-success">
                                            You match every required skill.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {graph.paths.length > 0 && (
                    <section className="mt-6 rounded-2xl border border-border bg-surface p-8">
                        <p className="text-sm font-medium text-foreground-muted">
                            Skill graph
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold">
                            Connections around {graph.skill}
                        </h2>

                        <p className="mt-2 text-sm text-foreground-secondary">
                            Explore how this required skill connects to other skills
                            through the graph.
                        </p>

                        <div className="mt-6 space-y-3">
                            {graph.paths.map((path, index) => (
                                <div
                                    key={`${path.join("-")}-${index}`}
                                    className="rounded-xl border border-border bg-background px-4 py-3"
                                >
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        {path.map((skill, skillIndex) => (
                                            <div
                                                key={`${skill}-${skillIndex}`}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="rounded-full bg-primary-soft/40 px-3 py-1 text-primary-light">
                                                    {skill}
                                                </span>

                                                {skillIndex < path.length - 1 && (
                                                    <span className="text-foreground-faint">
                                                        →
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
