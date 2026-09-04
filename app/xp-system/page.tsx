import type { Metadata } from "next";
import { Container } from "../components/container";
import { XPVisual } from "../components/xp-visual";
import { Reveal } from "../components/reveal";
import {
  leaderboardNote,
  leaderboardTypes,
  rewards,
  xpActivities,
  xpActivityFootnote,
  xpIntro,
  xpLevels,
  xpPenalties,
} from "../content/xp-content";

export const metadata: Metadata = {
  title: "XP System",
  description:
    "How XP works at DBCE Coders Club — how members earn experience points, level titles, leaderboards, rewards, and penalties.",
};

export default function XpSystemPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      {/* Hero ---------------------------------------------------- */}
      <section className="border-b border-border px-page py-section">
        <Container>
          <div className="flex items-center justify-between border-b border-border pb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
            <span>Community framework</span>
            <span className="text-accent-text">XP / 01</span>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-12">
            <Reveal>
              <h1 className="text-display font-display font-bold leading-display tracking-[-0.045em] text-foreground">
                XP
                <br />
                <span className="text-accent-text">System.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
                A simple way to recognize the time, energy, and care members
                put into the community. {xpIntro}
              </p>
            </Reveal>
            <Reveal delay={120} className="mx-auto w-full max-w-xs">
              <XPVisual />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* How you earn XP ------------------------------------------ */}
      <section
        aria-labelledby="earn-xp"
        className="border-b border-border px-page py-section"
      >
        <Container>
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-accent-text">01</span>
                <h2
                  id="earn-xp"
                  className="text-3xl font-display font-bold tracking-[-0.04em] text-foreground sm:text-4xl"
                >
                  How you earn XP
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted">
                Show up, share what you know, and keep building. Every
                contribution counts.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-10 overflow-hidden rounded-panel border border-border">
              <div className="flex items-center justify-between bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted sm:px-7">
                <span>Activity</span>
                <span>XP awarded</span>
              </div>
              <ul>
  {xpActivities.map((row, index) => (
    <li
      key={row.activity}
      className="group flex items-center justify-between border-t border-border px-5 py-5 transition-all duration-300 hover:bg-accent/5 sm:px-7"
    >
      <div className="flex items-center gap-5">
        <span className="font-mono text-xs text-accent-text opacity-60">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="text-sm text-foreground transition-transform duration-300 group-hover:translate-x-1 sm:text-base">
          {row.activity}

          {row.starred && (
            <span
              className="ml-1 text-accent-text"
              aria-hidden="true"
            >
              *
            </span>
          )}
        </span>
      </div>

      <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-sm font-semibold text-accent-text transition-all duration-300 group-hover:bg-accent group-hover:bg-accent/20 sm:text-base">
        +{row.xp} XP
      </span>
    </li>
  ))}
</ul>
            </div>
            <p className="mt-4 max-w-none whitespace-nowrap text-xs leading-6 text-muted">
              <span className="text-accent-text">*</span> {xpActivityFootnote}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Levels and titles ----------------------------------------- */}
      <section
        aria-labelledby="levels-titles"
        className="border-b border-border px-page py-section"
      >
        <Container>
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-accent-text">02</span>
                <h2
                  id="levels-titles"
                  className="text-3xl font-display font-bold tracking-[-0.04em] text-foreground sm:text-4xl"
                >
                  Levels and titles
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted">
                Keep moving forward. Your XP unlocks a title that reflects the
                way you contribute.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
  <div className="mt-10 grid gap-3">
    {xpLevels.map((level, index) => (
      <div
        key={level.level}
        className="group relative overflow-hidden rounded-panel border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 sm:p-6"
      >
        <div className="flex items-center gap-5">
          {/* Level number */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border font-mono text-sm text-accent-text transition-all duration-300 group-hover:border-accent group-hover:text-accent-foreground group-hover:text-accent-foreground">
            {String(level.level).padStart(2, "0")}
          </div>

          {/* Main content */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {level.title}
              </h3>

              <span className="font-mono text-sm text-accent-text">
                {level.xpRequired} XP
              </span>
            </div>

            {/* progression line */}
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700 group-hover:w-full"
                style={{
                  width: `${Math.min(100, 25 + index * 20)}%`,
                }}
              />
            </div>
          </div>

          <span className="hidden text-muted transition-transform duration-300 group-hover:translate-x-1 sm:block">
            →
          </span>
        </div>
      </div>
    ))}
  </div>
</Reveal>
        </Container>
      </section>

      {/* Leaderboards ------------------------------------------------ */}
      <section
        aria-labelledby="leaderboards"
        className="border-b border-border px-page py-section"
      >
        <Container>
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-accent-text">03</span>
              <h2
                id="leaderboards"
                className="text-3xl font-display font-bold tracking-[-0.04em] text-foreground sm:text-4xl"
              >
                Leaderboards
              </h2>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              {leaderboardNote}
            </p>
          </Reveal>

          <ul className="mt-10 grid gap-5 sm:grid-cols-3">
            {leaderboardTypes.map((board, index) => (
              <Reveal key={board.title} delay={index * 80} as="li">
                <div className="group relative h-full overflow-hidden rounded-panel border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50">
                
                  <span className="font-mono text-xs text-muted">
                    0{index + 1}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">
                    {board.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {board.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Rewards ------------------------------------------------------ */}
      <section
        aria-labelledby="rewards"
        className="border-b border-border px-page py-section"
      >
        <Container>
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-accent-text">04</span>
              <h2
                id="rewards"
                className="text-3xl font-display font-bold tracking-[-0.04em] text-foreground sm:text-4xl"
              >
                Rewards &amp; recognition
              </h2>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {rewards.map((reward) => (
                <li
                  key={reward}
                  className="group flex items-center gap-4 rounded-panel border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 hover:bg-accent/5"

                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full bg-accent transition-transform duration-300 group-hover:scale-150"
                    aria-hidden="true"
                  />
                  <span className="text-base font-medium text-foreground transition-transform duration-300 group-hover:translate-x-1">
                    {reward}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* Penalties — on ink to signal "the other side" of the ledger */}
      <section aria-labelledby="penalties" className="bg-ink px-page py-section text-ink-foreground">
        <Container>
          <Reveal>
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-xs text-accent">05</span>
              <h2
                id="penalties"
                className="text-3xl font-display font-bold tracking-[-0.04em] text-ink-foreground sm:text-4xl"
              >
                XP penalties
              </h2>
            </div>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink-muted">
              XP is a record of trust as much as effort. These deductions
              keep the system fair for everyone building in good faith.
            </p>
          </Reveal>
          <div className="mt-8 flex items-center justify-between">
  <span className="font-mono text-xs uppercase tracking-[0.16em] text-ink-muted">
    The other side of the ledger
  </span>

  <span className="font-mono text-xs text-accent">
    − XP
  </span>
</div>

          <Reveal delay={80}>
            <div className="mt-10 overflow-hidden rounded-panel border border-ink-border">
              <div className="flex items-center justify-between bg-white/5 px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted sm:px-7">
                <span>Violation</span>
                <span>Penalty</span>
              </div>
              <ul>
                {xpPenalties.map((row, index) => (
                  <li
                    key={row.violation}
                    className={`flex items-center justify-between border-t border-ink-border px-5 py-4 sm:px-7 ${
                      index % 2 === 1 ? "bg-white/[0.03]" : ""
                    }`}
                  >
                    <span className="text-sm text-ink-foreground sm:text-base">
                      {row.violation}
                    </span>
                    <span className="font-mono text-sm font-semibold text-accent sm:text-base">
                      {row.penalty} XP
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>
    </main>
  );
}
