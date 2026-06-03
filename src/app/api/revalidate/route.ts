import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// On-demand cache invalidation, called by the backend pipeline after a run
// (see revalidate.py). The pipeline almost always runs every task at once, so
// we invalidate the entire route tree rather than tagging individual domains.
export async function POST(request: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }
  if (request.headers.get("x-revalidate-secret") !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true });
}
