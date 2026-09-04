"use client";
import { useState } from "react";
import { motion } from "motion/react";

export function XPVisual() {
  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-[520px] items-center justify-center">
      
      {/* Connecting lines */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 520 420"
        fill="none"
        aria-hidden="true"
      >
        <motion.path
          d="M260 210 L120 105 L75 275 L205 350 L390 300 L440 130 L260 210"
          stroke="currentColor"
          strokeWidth="1"
          className="text-accent/40"
          strokeDasharray="5 7"
          animate={{ strokeDashoffset: [0, -24] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.path
          d="M120 105 L390 300 M75 275 L440 130 M205 350 L440 130"
          stroke="currentColor"
          strokeWidth="1"
          className="text-foreground/15"
        />
      </svg>

      {/* Outer orbit */}
      <motion.div
        className="absolute h-[310px] w-[310px] rounded-full border border-dashed border-accent/30"
        animate={{ rotate: 360 }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute h-[220px] w-[220px] rounded-full border border-dashed border-foreground/15"
        animate={{ rotate: -360 }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Central XP */}
      <motion.button
  type="button"
  className="relative z-10 flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-transform hover:scale-110"
  animate={{
    y: [0, -8, 0],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  onClick={() => {
    // Add XP interaction here later
  }}
>
        <span className="font-mono text-xs tracking-[0.25em] text-accent">
          EARN
        </span>

        <span className="mt-1 font-display text-5xl font-bold tracking-tight">
          XP
        </span>
      </motion.button>

      {/* Activity nodes */}
  <XPNode
  label="BUILD"
  description="Projects, prototypes and real systems."
  className="left-[8%] top-[18%]"
  delay={0}
/>

<XPNode
  label="LEARN"
  description="Workshops, skills and hands-on learning."
  className="right-[8%] top-[24%]"
  delay={0.8}
/>

<XPNode
  label="COMPETE"
  description="Hackathons, contests and challenges."
  className="bottom-[10%] left-[32%]"
  delay={1.6}
/>

<XPNode
  label="CONTRIBUTE"
  description="Community, events and helping others."
  className="bottom-[25%] right-[4%]"
  delay={2.4}
/>
    </div>
  );
}

function XPNode({
  label,
  description,
  className,
  delay,
}: {
  label: string;
  description: string;
  className: string;
  delay: number;
}) {
  const [active, setActive] = useState(false);

  return (
    <motion.button
      type="button"
      className={`absolute ${className} z-20 text-left`}
      animate={{
        y: [0, -7, 0],
        scale: active ? 1.08 : 1,
      }}
      transition={{
        y: {
          duration: 4,
          delay,
          repeat: Infinity,
          ease: "easeInOut",
        },
        scale: {
          duration: 0.25,
        },
      }}
      onClick={() => setActive((value) => !value)}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
    >
      <div
        className={`rounded-full border px-4 py-2 backdrop-blur-sm transition-all duration-300 ${
          active
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border bg-background/90"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${
              active ? "bg-accent-foreground" : "bg-accent"
            }`}
          />

          <span
            className={`font-mono text-[10px] tracking-[0.16em] ${
              active
                ? "text-accent-foreground"
                : "text-muted-foreground"
            }`}
          >
            {label}
          </span>
        </div>

        {active && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-2 max-w-[150px] text-xs leading-relaxed"
          >
            {description}
          </motion.p>
        )}
      </div>
    </motion.button>
  );
}