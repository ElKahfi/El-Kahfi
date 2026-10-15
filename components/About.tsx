import { Arrow } from "./Arrow";

const skills = [
  { title: "Development", items: ["Python", "JavaScript", "TypeScript", "React", "HTML", "CSS"] },
  { title: "Data and Infrastructure", items: ["SQL", "AWS/Cloud", "Docker"] },
  { title: "Design and Tools", items: ["Figma", "GitHub", "VS Code"] },
];

export function About() {
  return (
    <section id="about" className="about-page" aria-labelledby="about-title" tabIndex={-1}>
        <section className="about-intro" aria-labelledby="about-title">
          <h2 id="about-title">About Me</h2>
          <div>
            <p>Through my past work, I have aimed to build lasting applications rooted in usefulness. Although my work may be flawed, I strive to become better than I was yesterday. I build useful systems through effective design.</p>
            <a className="about-cv" href="/documents/athariq-el-kahfi-cv.pdf" download="Athariq El Kahfi CV.pdf">Download CV <Arrow direction="down" /></a>
          </div>
        </section>
        <section className="about-section" aria-labelledby="skills-title">
          <h2 id="skills-title">Skills</h2>
          <div className="about-skills">
            {skills.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <ul>{group.items.map((skill) => <li key={skill}>{skill}</li>)}</ul>
              </div>
            ))}
          </div>
        </section>
        <section className="about-section" aria-labelledby="contact-title">
          <h2 id="contact-title">Contact</h2>
          <dl className="about-contact">
            <div><dt>Phone</dt><dd><a href="tel:08151610212">+62 815-1610-212</a></dd></div>
            <div><dt>Email</dt><dd><a href="mailto:Athariq.Elkahfi@gmail.com">athariq.elkahfi@gmail.com</a></dd></div>
            <div><dt>LinkedIn</dt><dd><a href="https://www.linkedin.com/in/athariq-el-kahfi-a20109298/?isSelfProfile=true">LinkedIn profile</a></dd></div>
            <div><dt>GitHub</dt><dd><a href="https://github.com/ElKahfi">github.com/ElKahfi</a></dd></div>
          </dl>
        </section>
    </section>
  );
}
