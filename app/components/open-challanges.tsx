const challenges = [
  {
    level: "BEGINNER",
    xp: "150 XP",
    title: "Ship your first CLI",
    description:
      "A weekend-sized task to get comfortable with Git, testing, and shipping.",
  },
  {
    level: "INTERMEDIATE",
    xp: "400 XP",
    title: "Rebuild an API",
    description:
      "Take a public API, reimplement it, and defend your schema choices.",
  },
  {
    level: "ADVANCED",
    xp: "900 XP",
    title: "Open-source patch",
    description:
      "Land a merged pull request in a real repository used by real people.",
  },
];

export function OpenChallenges() {
  return (
    <section className="px-page pt-4 pb-20">
      <div className="mx-auto max-w-content">

        {/* Heading */}
        <div className="mb-16 flex items-end justify-between border-t border-border pt-8">
          <div>
            <p className="label-eyebrow mb-6 text-accent">
              Weekly drops
            </p>

            <h2 className="text-5xl font-bold tracking-tight md:text-7xl">
              Open <span className="text-accent">challenges.</span>
            </h2>
          </div>

          
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {challenges.map((challenge) => (
            <article
              key={challenge.title}
              className="group flex min-h-[330px] flex-col justify-between border border-border bg-background p-8 transition-all duration-300 hover:-translate-y-1 hover:border-foreground"
            >
              <div>
                <div className="mb-16 flex items-center justify-between">
                  <span className="label-eyebrow text-muted">
                    {challenge.level}
                  </span>

                  <span className="label-eyebrow text-accent">
                    {challenge.xp}
                  </span>
                </div>

                <h3 className="mb-5 text-2xl font-bold md:text-3xl">
                  {challenge.title}
                </h3>

                <p className="max-w-sm text-base leading-7 text-muted">
                  {challenge.description}
                </p>
              </div>

              <button className="mt-10 w-fit text-sm font-medium transition-transform duration-300 group-hover:translate-x-1">
                Take the challenge ↗
              </button>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}