export type ProjectImage = { src: string; alt: string; width: number; height: number; title?: string; caption?: string };
export type ProjectSlide = { image: ProjectImage; heading: string; body: string };

export type Project = {
  slug: string;
  title: string;
  year: number | null;
  summary: string;
  role: string | null;
  tools: string[];
  repository?: string;
  coverImage: string;
  coverAlt: string;
  presentation: "mascot" | "interface";
  previewImage: string;
  previewVideo?: string;
  gallery: ProjectImage[];
  detailContent: { heading: string; body: string }[];
  caseStudy?: { capabilities: string[]; contributions: string[] };
  isPlaceholder: boolean;
  theme: "light" | "dark";
};

// Owner-supplied descriptions. Unknown metadata stays empty. Screenshots do not
// establish measured outcomes, implementation tools, or individual responsibilities.
export const projects: Project[] = [
  {
    slug: "sentri", title: "SENTRI", year: 2026,
    repository: "https://github.com/ElKahfi/Sentricol",
    summary: "An AI-powered cybersecurity training platform where employees practice real workplace decisions, receive immediate feedback, and track their security development.",
    role: "Team Leader", tools: ["PostgreSQL", "Docker", "AWS EC2", "Coolify"], isPlaceholder: false, theme: "dark", presentation: "interface",
    coverImage: "/images/sentri-dispatch.webp",
    coverAlt: "SENTRI Dispatch training interface showing the workplace task queue, email investigation, and learner progress",
    previewImage: "/images/sentri-poster.webp",
    previewVideo: "/media/sentri-preview.mp4",
    gallery: [
      { src: "/images/sentri-dispatch.webp", alt: "SENTRI Dispatch training console showing an email, password, and data task queue, investigation details, daily progress, and the mascot guide", width: 2170, height: 1196, title: "Dispatch — the core training experience", caption: "Dispatch is SENTRI’s core learning console. Employees investigate suspicious emails, review passwords, and classify sensitive data through workplace scenarios. Each decision receives feedback, and recorded results track their learning progress." },
      { src: "/images/sentri-architecture.webp", alt: "SENTRI architecture linking admin, learner, and Gmail browsers to Deployment, Dispatch, and Protocol services, with PostgreSQL, Ollama, Google OAuth, and Gmail API connections", width: 2036, height: 990, title: "Technical architecture", caption: "Deployment manages company access, Dispatch delivers training, and Protocol reviews email risks. PostgreSQL stores records; Ollama supports AI workflows, while Google OAuth and the Gmail API connect Protocol to Gmail." },
      { src: "/images/sentri-protocol.webp", alt: "SENTRI Protocol Gmail connection screen with Google sign-in and security-analysis setup", width: 2400, height: 1561, title: "Protocol — Gmail continuation training", caption: "Connect Gmail to retrieve and assess messages for potential security risks, extending security awareness into everyday email decisions." },
      { src: "/images/sentri-admin.webp", alt: "SENTRI company control center showing employee records, invitation states, and tabs for training progress and Protocol alerts in a demo workspace", width: 2400, height: 1561, title: "Deployment — admin panel", caption: "Company and employee management brings registration, invitations, and training administration together. This screenshot shows a demo workspace with simulated invitations." },
      { src: "/images/sentri-deployment.webp", alt: "SENTRI Deployment entry screen offering company registration and administrator login", width: 2400, height: 1561, title: "Deployment — company setup", caption: "The entry point for registering a company and administrator account, or returning to manage an existing company’s training." },
    ],
    detailContent: [
      { heading: "Practical security awareness", body: "Interactive scenarios cover suspicious emails, password decisions, and sensitive-data classification. Each decision receives feedback, with results recorded to support ongoing learning." },
    ],
    caseStudy: {
      capabilities: [
        "Dispatch: the core browser-based training console for email, password, and sensitive-data scenarios, with immediate feedback and learner progress tracking.",
        "Company and employee management backed by persistent PostgreSQL records.",
        "Dockerized services deployed on AWS EC2 through Coolify.",
        "AI-assisted training and security analysis, including Protocol’s Gmail message-risk assessment.",
      ],
      contributions: [
        "Designed the PostgreSQL model for companies, employees, training content, assignments, attempts, results, and progress.",
        "Built the Docker setup, connected services to AWS EC2, and helped configure deployment through Coolify.",
        "Contributed to the integration of Deployment, Dispatch, Protocol, the database, and infrastructure.",
        "Coordinated development priorities with product goals and reviewed data flow, system behavior, and integration risks.",
        "Supported AI integrations for model-based analysis and cybersecurity training.",
      ],
    },
  },
  {
    slug: "communimate", title: "Communimate", year: null,
    repository: "https://github.com/ElKahfi/Communimate",
    summary: "A communication-improvement product that helps people identify speech weaknesses and discover communication methods that suit them best.",
    role: null, tools: [], isPlaceholder: false, theme: "dark", presentation: "interface",
    coverImage: "/images/communimate.webp",
    coverAlt: "Communimate practice interface with an illustrated living room and choices for storytelling, presentation, conversation, and interview practice",
    previewImage: "/images/communimate.webp",
    gallery: [
      { src: "/images/communimate.webp", alt: "Communimate's practice screen showing setting, practice style, and recording choices", width: 1732, height: 1004 },
    ],
    detailContent: [
      { heading: "Find a way of speaking that fits", body: "Communimate is designed to help people identify weaknesses in their speech and explore communication methods that suit them. The product centers on practice and individual communication needs." },
      { heading: "Choose the setting for practice", body: "The supplied interface offers storytelling, presentation, conversation, and interview settings. It also shows choices for one-way or conversational practice and whether to display the user's camera reflection." },
    ],
  },
  {
    slug: "mojo", title: "Mojo", year: null,
    summary: "An UTBK training platform that generates unlimited UTBK-style questions and guides practice through a skill-tree-based learning journey.",
    role: null, tools: [], isPlaceholder: false, theme: "dark", presentation: "interface",
    coverImage: "/images/mojo.webp",
    coverAlt: "Mojo's dark learning interface showing a branching quantitative skill tree and progress panels",
    previewImage: "/images/mojo.webp",
    gallery: [
      { src: "/images/mojo.webp", alt: "Mojo skill tree connecting quantitative topics, with subject tabs and a learning-progress sidebar", width: 2400, height: 1561 },
    ],
    detailContent: [
      { heading: "Practice for the UTBK journey", body: "Mojo is an UTBK-focused training platform. It generates unlimited UTBK-style practice questions and organizes the learning journey around branches of a skill tree." },
      { heading: "See how skills connect", body: "The supplied interface maps connected topics as nodes in a tree. Subject tabs and progress panels sit alongside that map, bringing topic relationships and practice progress into the same view." },
    ],
  },
];

export const legacyProjectSlugs: Record<string, string> = {
  "project-01": "sentri", "project-02": "communimate", "project-03": "mojo",
};

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

// Gallery captions define visual case-study slides. Projects with a single
// supplied image reuse it across their existing narrative sections.
export function getProjectSlides(project: Project): ProjectSlide[] {
  if (project.gallery.every(image => image.title && image.caption)) {
    const images = [...project.gallery].sort((a, b) => Number(a.title === "Technical architecture") - Number(b.title === "Technical architecture"));
    return images.map(image => ({ image, heading: image.title!, body: image.caption! }));
  }
  return project.detailContent.map((section, index) => ({
    image: project.gallery[Math.min(index, project.gallery.length - 1)],
    heading: section.heading,
    body: section.body,
  }));
}
