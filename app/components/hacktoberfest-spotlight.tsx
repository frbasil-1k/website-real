"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type TouchEvent,
} from "react";
import { createPortal } from "react-dom";

/**
 * Hacktoberfest 2026 spotlight.
 *
 * Two official posters, one at a time. The two files have very different
 * aspect ratios - the banner is 508x2048 (about 1:4) and the event poster is
 * 1024x565 - so neither is forced into a shared image box. Each slide uses its
 * own layout and every image is rendered with object-fit: contain, which keeps
 * the artwork complete and undistorted at every width.
 *
 * The carousel pauses on hover, focus, reduced motion, an open lightbox and
 * while the section is off-screen. Every manual action resets the six-second
 * timer because the effect below is keyed on the active slide.
 */

type Poster = {
  id: "portrait" | "landscape";
  src: string;
  width: number;
  height: number;
  alt: string;
  kind: string;
  title: string;
  caption: string;
  sizes: string;
};

const AUTOPLAY_MS = 6000;
const SWIPE_DISTANCE = 48;
const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const POSTERS: readonly Poster[] = [
  {
    id: "portrait",
    src: "/images/events/hacktoberfest-2026-portrait.jpg",
    width: 508,
    height: 2048,
    alt: "Portrait Hacktoberfest 2026 banner by DBCE Coders Club. The word Hacktoberfest is stacked vertically in floral and blue-tile lettering, surrounded by open-source stickers, with the DBCE Coders Club and Major League Hacking marks.",
    kind: "Portrait banner",
    title: "DBCE Coders Club presents",
    caption:
      "The tall official banner, in association with Major League Hacking. Open it full size to read every sticker.",
    sizes: "(max-width: 640px) 30vw, (max-width: 900px) 25vw, 16vw",
  },
  {
    id: "landscape",
    src: "/images/events/hacktoberfest-2026-landscape.jpg",
    width: 1024,
    height: 565,
    alt: "Landscape Hacktoberfest 2026 poster by DBCE Coders Club and Major League Hacking. The Hackathon Goa artwork shows the Hacktoberfest lettering, an illustrated blue octopus, and the date October 31, 2026.",
    kind: "Event poster",
    title: "Hackathon Goa 2026",
    caption:
      "The illustrated event poster for October 31, 2026, in Goa, India, presented by DBCE Coders Club and MLH.",
    sizes: "(max-width: 640px) 90vw, (max-width: 900px) 82vw, 60vw",
  },
];

export function HacktoberfestSpotlight() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const suppressTimer = useRef<number | null>(null);

  const total = POSTERS.length;

  const goTo = useCallback(
    (index: number) => setActive(((index % total) + total) % total),
    [total],
  );

  const next = useCallback(
    () => setActive((current) => (current + 1) % total),
    [total],
  );

  const previous = useCallback(
    () => setActive((current) => (current - 1 + total) % total),
    [total],
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  // Track the OS motion preference live, and start with rotation off for
  // anyone who has asked for reduced motion.
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Do not rotate a section nobody is looking at.
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const rotationStopped =
    userPaused ||
    reducedMotion ||
    hovered ||
    focused ||
    !inView ||
    lightboxIndex !== null;

  useEffect(() => {
    if (rotationStopped) return;

    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [active, next, rotationStopped]);

  useEffect(
    () => () => {
      if (suppressTimer.current !== null) {
        window.clearTimeout(suppressTimer.current);
      }
    },
    [],
  );

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
    suppressClick.current = false;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    // Horizontal intent only, so a vertical page scroll never changes slides.
    if (
      Math.abs(deltaX) < SWIPE_DISTANCE ||
      Math.abs(deltaX) <= Math.abs(deltaY)
    ) {
      return;
    }

    // The browser still fires a click on the poster after a swipe. Swallow
    // that one click so a swipe does not open the lightbox.
    suppressClick.current = true;
    if (suppressTimer.current !== null) {
      window.clearTimeout(suppressTimer.current);
    }
    suppressTimer.current = window.setTimeout(() => {
      suppressClick.current = false;
    }, 500);

    if (deltaX < 0) next();
    else previous();
  };

  const handleStageKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  };

  const openPoster = (index: number) => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    setLightboxIndex(index);
  };

  const activePoster = POSTERS[active];

  return (
    <section
      id="hacktoberfest"
      ref={sectionRef}
      className="hf-section"
      aria-labelledby="hf-title"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget as Node | null)
        ) {
          setFocused(false);
        }
      }}
    >
      <div className="hf-panel">
        <div className="hf-panel__glow" aria-hidden="true" />
        <HacktoberfestPattern />

        <header className="hf-header">
          <div>
            <p className="hf-eyebrow">
              <span className="hf-eyebrow__badge">MLH</span>
              <span>Hacktoberfest 2026</span>
            </p>

            <h2 id="hf-title">
              Hacktoberfest
              <span className="hf-title__year">2026.</span>
            </h2>
          </div>

          <div className="hf-header__aside">
            <p className="hf-lede">
              Build together. Contribute to open source. Make an impact.
            </p>

            <ul className="hf-meta" aria-label="Event details">
              <li>31 October 2026</li>
              <li>Goa, India</li>
              <li>DBCE Coders Club × MLH</li>
            </ul>
          </div>
        </header>

        <div
          className="hf-stage"
          role="region"
          aria-roledescription="carousel"
          aria-label="Official Hacktoberfest 2026 posters"
          onKeyDown={handleStageKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="hf-slides">
            {POSTERS.map((poster, index) => {
              const isActive = index === active;

              return (
                <article
                  key={poster.id}
                  className={`hf-slide hf-slide--${poster.id}${
                    isActive ? " is-active" : ""
                  }`}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${total}: ${poster.kind}`}
                  aria-hidden={!isActive}
                  inert={!isActive}
                >
                  <div className="hf-layout">
                    {index === 0 && (
                      <div className="hf-dateblock" aria-hidden="true">
                        <p className="hf-dateblock__label">Date</p>
                        <p className="hf-dateblock__day">31</p>
                        <p className="hf-dateblock__month">October 2026</p>
                        <p className="hf-dateblock__place">Goa, India</p>
                      </div>
                    )}

                    <div className="hf-media">
                      <button
                        type="button"
                        className={`hf-poster hf-poster--${poster.id}`}
                        onClick={() => openPoster(index)}
                        aria-label={`View the ${poster.kind.toLowerCase()} at full size`}
                      >
                        <span className="hf-poster__mat">
                          <Image
                            src={poster.src}
                            alt={poster.alt}
                            width={poster.width}
                            height={poster.height}
                            sizes={poster.sizes}
                            className="hf-poster__image"
                            draggable={false}
                          />
                        </span>
                      </button>
                    </div>

                    <div className="hf-caption">
                      <p className="hf-kicker">
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        {poster.kind}
                      </p>
                      <p className="hf-caption__title">{poster.title}</p>
                      <p className="hf-caption__copy">{poster.caption}</p>

                      <button
                        type="button"
                        className="hf-open"
                        onClick={() => openPoster(index)}
                      >
                        View full poster
                        <span aria-hidden="true">↗</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="sr-only" aria-live="polite" aria-atomic="true">
            Poster {active + 1} of {total}: {activePoster.kind}
          </p>
        </div>

        <div className="hf-bar">
          <div className="hf-bar__nav">
            <button
              type="button"
              className="hf-arrow"
              onClick={previous}
              aria-label="Show previous poster"
            >
              <span aria-hidden="true">←</span>
            </button>

            <div className="hf-dots" role="group" aria-label="Choose a poster">
              {POSTERS.map((poster, index) => (
                <button
                  key={poster.id}
                  type="button"
                  className={`hf-dot${index === active ? " is-active" : ""}`}
                  onClick={() => goTo(index)}
                  aria-label={`Show poster ${index + 1} of ${total}: ${
                    poster.kind
                  }`}
                  aria-current={index === active ? "true" : undefined}
                >
                  <span aria-hidden="true" />
                </button>
              ))}
            </div>

            <button
              type="button"
              className="hf-arrow"
              onClick={next}
              aria-label="Show next poster"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="hf-bar__meta">
            <p className="hf-count" aria-hidden="true">
              {String(active + 1).padStart(2, "0")}
              <span>/</span>
              {String(total).padStart(2, "0")}
            </p>

            {!reducedMotion && (
              <button
                type="button"
                className="hf-toggle"
                onClick={() => setUserPaused((paused) => !paused)}
              >
                <span className="hf-toggle__glyph" aria-hidden="true">
                  {userPaused ? "▶" : "❚❚"}
                </span>
                {userPaused ? "Resume slideshow" : "Pause slideshow"}
              </button>
            )}

            <p className="hf-hint">
              Swipe or use ← → · Autoplay {reducedMotion ? "off" : "6s"}
            </p>
          </div>
        </div>
      </div>

      {typeof document !== "undefined" &&
        lightboxIndex !== null &&
        createPortal(
          <PosterLightbox
            poster={POSTERS[lightboxIndex]}
            index={lightboxIndex}
            total={total}
            onClose={closeLightbox}
          />,
          document.body,
        )}
    </section>
  );
}

/**
 * Decorative azulejo-style tile grid. Pure SVG, no extra asset, and hidden
 * from assistive technology because it carries no information.
 */
function HacktoberfestPattern() {
  return (
    <svg
      className="hf-pattern"
      viewBox="0 0 240 240"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id="hf-azulejo"
          width="60"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 2 58 30 30 58 2 30Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="30" cy="30" r="7" fill="none" stroke="currentColor" />
          <path
            d="M30 23v14M23 30h14M9 9l8 8M51 9l-8 8M9 51l8-8M51 51l-8-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="240" height="240" fill="url(#hf-azulejo)" />
    </svg>
  );
}

type PosterLightboxProps = {
  poster: Poster;
  index: number;
  total: number;
  onClose: () => void;
};

/**
 * Portal lightbox. It locks body scroll, traps Tab inside the dialog, closes on
 * Escape or a backdrop click, and returns focus to the control that opened it.
 * The image is rendered at its intrinsic width (capped by the viewport) inside
 * a scrollable panel, so the 2048px-tall banner can be read top to bottom.
 */
function PosterLightbox({
  poster,
  index,
  total,
  onClose,
}: PosterLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    closeRef.current?.focus();

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === first || !dialog.contains(activeElement)) {
          event.preventDefault();
          last.focus();
        }
        return;
      }

      if (activeElement === last || !dialog.contains(activeElement)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="hf-lightbox"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="hf-lightbox__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hf-lightbox-title"
        aria-describedby="hf-lightbox-description"
      >
        <header className="hf-lightbox__bar">
          <div>
            <p className="hf-lightbox__eyebrow">
              Hacktoberfest 2026 · {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </p>
            <h2 id="hf-lightbox-title" className="hf-lightbox__title">
              {poster.kind}
            </h2>
          </div>

          <button
            ref={closeRef}
            type="button"
            className="hf-lightbox__close"
            onClick={onClose}
            aria-label="Close full poster"
          >
            <span aria-hidden="true">×</span>
            Close
          </button>
        </header>

        <div className="hf-lightbox__scroll">
          <Image
            src={poster.src}
            alt={poster.alt}
            width={poster.width}
            height={poster.height}
            sizes="(max-width: 1080px) 100vw, 1040px"
            className="hf-lightbox__image"
            draggable={false}
          />
        </div>

        <div className="hf-lightbox__foot">
          <p id="hf-lightbox-description" className="hf-lightbox__hint">
            {poster.id === "portrait"
              ? "Scroll inside the frame to read the full banner."
              : "The complete official poster, shown without cropping."}
            <span> Press Esc to close.</span>
          </p>

          <a
            className="hf-lightbox__download"
            href={poster.src}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open image in a new tab <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
