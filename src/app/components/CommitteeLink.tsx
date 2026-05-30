import Link from "next/link";

export function CommitteeLink({
  committeeId,
  committeeName,
  className,
}: {
  committeeId: string;
  committeeName: string;
  className?: string;
}) {
  return (
    <Link className={className} href={`/2026/committees/${committeeId}`}>
      {committeeName}
    </Link>
  );
}
