import Link from "next/link";

type Job = {
    id: string;
    title: string;
    location: string;
    workMode: string;
    experience: string;
    company: string;
    requiredSkills: string[];
};

type GraphData = {
    skill: string;
    paths: string[][];
};

async function getJob(id: string): Promise<Job> {
    const response = await fetch(
        `http://localhost:3000/api/jobs/${id}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch job");
    }

    return response.json();
}

async function getSkillGraph(skill: string): Promise<GraphData> {
    const response = await fetch(
        `http://localhost:3000/api/graph?skill=${encodeURIComponent(skill)}`,
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
        <main className="min-h-screen bg-zinc-950 text-white">
            <div className="mx-auto max-w-4xl px-6 py-16">
                <Link
                    href="/"
                    className="text-sm text-zinc-500 hover:text-white"
                >
                    ← Back to jobs
                </Link>

                <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                    <p className="text-sm font-medium text-cyan-400">
                        {job.company}
                    </p>

                    <h1 className="mt-2 text-4xl font-bold">
                        {job.title}
                    </h1>

                    <p className="mt-4 text-zinc-400">
                        {job.location} · {job.workMode} · {job.experience}
                    </p>
                    {selectedSkills.length > 0 && (
                        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950 p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-zinc-500">
                                        Your skill match
                                    </p>

                                    <p className="mt-1 text-3xl font-bold text-cyan-300">
                                        {matchPercentage}%
                                    </p>
                                </div>

                                <p className="text-sm text-zinc-500">
                                    {matchedSkills.length} of {job.requiredSkills.length} skills
                                </p>
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                                <div
                                    className="h-full rounded-full bg-cyan-400"
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
                                    className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-sm text-cyan-300"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                    {selectedSkills.length > 0 && (
                        <div className="mt-8 grid gap-6 sm:grid-cols-2">
                            <div>
                                <h3 className="text-sm font-medium text-zinc-400">
                                    You have
                                </h3>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {matchedSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="rounded-full bg-cyan-400/10 px-3 py-1.5 text-sm text-cyan-300"
                                        >
                                            ✓ {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-zinc-400">
                                    Skills to develop
                                </h3>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    {missingSkills.length > 0 ? (
                                        missingSkills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="rounded-full bg-zinc-800 px-3 py-1.5 text-sm text-zinc-400"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-cyan-300">
                                            You match every required skill.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {graph.paths.length > 0 && (
                    <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
                        <p className="text-sm font-medium text-cyan-400">
                            Skill graph
                        </p>

                        <h2 className="mt-1 text-2xl font-semibold">
                            Connections around {graph.skill}
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            Explore how this required skill connects to other skills
                            through the graph.
                        </p>

                        <div className="mt-6 space-y-3">
                            {graph.paths.map((path, index) => (
                                <div
                                    key={`${path.join("-")}-${index}`}
                                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
                                >
                                    <div className="flex flex-wrap items-center gap-2 text-sm">
                                        {path.map((skill, skillIndex) => (
                                            <div
                                                key={`${skill}-${skillIndex}`}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300">
                                                    {skill}
                                                </span>

                                                {skillIndex < path.length - 1 && (
                                                    <span className="text-zinc-600">
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