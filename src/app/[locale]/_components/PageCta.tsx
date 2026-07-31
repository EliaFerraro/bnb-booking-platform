import Link from "next/link";
import { Button } from "@/ui/components/shadcn/button";

interface Props {
  title: string;
  body: string;
  button: string;
  href: string;
  /** Background tone of the band. */
  variant?: "sage" | "sand";
}

export function PageCta({
  title,
  body,
  button,
  href,
  variant = "sage",
}: Props) {
  const isSage = variant === "sage";
  return (
    <section
      className={
        isSage
          ? "w-full bg-secondary-500 text-neutral-50 py-16 md:py-24 px-6"
          : "w-full bg-secondary-50 text-neutral-950 py-16 md:py-24 px-6"
      }
    >
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        <h2 className="font-serif text-3xl md:text-4xl tracking-[0.15em] uppercase mb-6 leading-tight">
          {title}
        </h2>
        <p
          className={`text-base md:text-lg leading-relaxed font-light mb-10 max-w-xl ${
            isSage ? "text-secondary-50/90" : "text-neutral-700"
          }`}
        >
          {body}
        </p>
        <Button
          asChild
          variant="secondary"
          className={
            isSage
              ? "bg-secondary-200 text-neutral-900 px-10 py-6 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-secondary-50 transition-colors shadow-md h-auto"
              : "bg-primary-500 text-neutral-50 px-10 py-6 rounded-full text-xs font-semibold tracking-widest uppercase hover:bg-primary-700 transition-colors shadow-md h-auto"
          }
        >
          <Link href={href}>{button}</Link>
        </Button>
      </div>
    </section>
  );
}
