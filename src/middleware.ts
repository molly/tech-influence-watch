import { NextRequest, NextResponse } from "next/server";

// Old URLs carried the sector as a query param (?sector=crypto|ai). The sector
// now lives in the path, so redirect those to the canonical path-based URL.
// The stale query param is dropped, which keeps the redirect from looping back
// onto this same rule.
export function middleware(request: NextRequest) {
  const sector = request.nextUrl.searchParams.get("sector");
  if (sector !== "crypto" && sector !== "ai") {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const dest = request.nextUrl.clone();
  dest.searchParams.delete("sector");

  if (pathname === "/") {
    dest.pathname = `/${sector}`;
  } else if (
    pathname.startsWith("/2026/") &&
    !pathname.startsWith("/2026/crypto/") &&
    !pathname.startsWith("/2026/ai/")
  ) {
    dest.pathname = `/2026/${sector}${pathname.slice("/2026".length)}`;
  }
  // For already-prefixed or other paths we simply drop the stale query param.

  return NextResponse.redirect(dest);
}

export const config = {
  matcher: ["/", "/2026/:path*"],
};
