import Image from "next/image";
import Link from "next/link";

function SectionBackdrop() {
  return (
    <div className="section-backdrop" aria-hidden="true">
      <Image src="/images/city.webp" alt="" fill sizes="100vw" />
    </div>
  );
}

export function ProjectSection({ university = false }: { university?: boolean }) {
  if (!university) {
    return (
      <section className="project-section project-section--personal" aria-labelledby="projects-title">
        <SectionBackdrop />
        <div className="personal-intro">
          <h2 id="projects-title">Projects <span>(Personal / Team)</span></h2>
        </div>
      </section>
    );
  }

  return (
    <section className="screen project-section project-section--university" aria-labelledby="university-title">
      <SectionBackdrop />
      <div className="university-intro">
        <h2 id="university-title">University <span>Projects</span></h2>
        <Link className="section-action" href="/university-projects">
          <span>Explore University Projects</span>
        </Link>
      </div>
    </section>
  );
}
