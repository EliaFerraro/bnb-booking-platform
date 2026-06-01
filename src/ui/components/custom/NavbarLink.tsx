import Link from "next/link";

interface Props {
  href: string;
  label: string;
}

export function NavbarLink({ href, label }: Props) {
  return (
    <Link
      href={href}
      className="px-4 py-2 hover:bg-primary-400 uppercase transition-colors duration-300 ease-in-out rounded-full"
    >
      {label}
    </Link>
  );
}
