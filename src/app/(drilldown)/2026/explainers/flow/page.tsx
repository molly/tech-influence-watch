import type { Metadata } from "next";

import FlowView, { flowMetadata } from "./FlowView";

export function generateMetadata(): Metadata {
  return flowMetadata();
}

export default function FlowPage() {
  return <FlowView />;
}
