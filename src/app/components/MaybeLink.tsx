import Link from "next/link";

export default function MaybeLink({
  href,
  className,
  children,
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (href) {
    return <Link href={href} className={className}>{children}</Link>;
  }
  return children;
}
