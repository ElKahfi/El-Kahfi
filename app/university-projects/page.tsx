import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/Arrow";
import { Navigation } from "@/components/Navigation";
import { UniversityProjects } from "@/components/UniversityProjects";
import { universityProjects } from "@/data/university-projects";

export const metadata: Metadata = {
  title: "University Projects",
  description: "University projects in systems analysis, digital service design, and fashion: Copyin, TukaKu, and Batikeryday.",
};

export default function UniversityProjectsPage() {
  return <>
    <Navigation detail />
    <main id="main" className="detail-page university-page" tabIndex={-1}>
      <div className="detail-toolbar"><Link className="text-link" href="/#university"><Arrow direction="left" /> Back to portfolio</Link></div>
      <header className="university-heading" id="top"><span className="eyebrow">Selected coursework / 03 projects</span><h1>University <em>Projects</em></h1><p>Exploring systems, services, and everyday design through collaborative university projects.</p></header>
      <UniversityProjects projects={universityProjects} />
      <div className="detail-footer"><Link href="/">ELKAHFI</Link><span>System Design</span></div>
    </main>
  </>;
}
