import Link from "next/link";
import { Arrow } from "@/components/Arrow";

export default function NotFound() {
  return <main id="main" className="not-found"><span className="eyebrow">ELKAHFI / 404</span><h1>A missing<br /><em>connection.</em></h1><p>This page could not be found.</p><Link className="text-link" href="/"><Arrow direction="left" /> Back to the portfolio</Link></main>;
}
