import type { ReactNode } from "react";

/**
 * Shared shell for the privacy, cookie and terms pages.
 *
 * No photographic hero: these pages are read, not browsed, and a full-bleed
 * image would push the first sentence below the fold. The narrow measure and
 * the numbered sections are the point — someone looking for the retention
 * period should find it by scanning, not by reading.
 */

interface LegalPageProps {
  eyebrow: string;
  title: string;
  /** "Last updated" line, already formatted for the locale. */
  updated: string;
  intro: string;
  children: ReactNode;
}

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  children,
}: LegalPageProps) {
  return (
    <>
      <section className="w-full bg-primary-500 text-neutral-50 pt-32 pb-16 md:pt-40 md:pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="font-sans text-xs tracking-[0.35em] uppercase font-semibold text-secondary-200 block mb-5">
            {eyebrow}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl tracking-[0.2em] uppercase mb-6">
            {title}
          </h1>
          <div className="h-px w-16 bg-secondary-200/70 mx-auto mb-6" />
          <p className="text-[11px] tracking-[0.2em] uppercase text-secondary-200/80">
            {updated}
          </p>
        </div>
      </section>

      <section className="w-full bg-neutral-50 py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-base md:text-lg text-neutral-700 leading-relaxed font-light mb-12 md:mb-16">
            {intro}
          </p>
          <div className="flex flex-col gap-12">{children}</div>
        </div>
      </section>
    </>
  );
}

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-serif text-xl md:text-2xl tracking-[0.15em] uppercase text-primary-500 pb-3 border-b border-neutral-200">
        {title}
      </h2>
      <div className="flex flex-col gap-4 text-sm md:text-base text-neutral-700 leading-relaxed font-light">
        {children}
      </div>
    </section>
  );
}

/** A labelled fact — used for the controller's details and the cookie entries. */
export function LegalDefinition({
  term,
  children,
}: {
  term: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4">
      <dt className="sm:w-40 shrink-0 text-xs tracking-[0.15em] uppercase text-secondary-600 font-semibold pt-0.5">
        {term}
      </dt>
      <dd className="text-neutral-700">{children}</dd>
    </div>
  );
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="flex flex-col gap-3 pl-1">{children}</ul>;
}

export function LegalListItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-secondary-600"
      />
      <span>{children}</span>
    </li>
  );
}
