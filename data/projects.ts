export type ProjectImage = { src: string; alt: string; width: number; height: number; title?: string; caption?: string };
export type ProjectSlide = { image: ProjectImage; heading: string; body: string };

export type Project = {
  slug: string;
  title: string;
  year: number | "Ongoing" | null;
  summary: string;
  role: string | null;
  tools: string[];
  repository?: string;
  website?: string;
  coverImage: string;
  coverAlt: string;
  presentation: "mascot" | "interface";
  previewImage: string;
  previewVideo?: string;
  gallery: ProjectImage[];
  detailContent: { heading: string; body: string }[];
  caseStudy?: { capabilities?: string[]; contributions?: string[]; sections?: { heading: string; body: string }[] };
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
    slug: "communimate", title: "Communimate", year: "Ongoing",
    repository: "https://github.com/ElKahfi/Communimate",
    summary: "An ongoing communication practice companion exploring how personalized coaching can help people speak more clearly, confidently, and in their own style.",
    role: "Independent Project", tools: ["HTML", "CSS", "JavaScript"], isPlaceholder: false, theme: "dark", presentation: "interface",
    coverImage: "/images/communimate.webp",
    coverAlt: "Communimate practice interface with an illustrated living room and choices for storytelling, presentation, conversation, and interview practice",
    previewImage: "/images/communimate.webp",
    gallery: [
      { src: "/images/communimate.webp", alt: "Communimate's practice screen showing setting, practice style, and recording choices", width: 1732, height: 1004 },
    ],
    detailContent: [
      { heading: "A calmer place to practice", body: "Communimate explores a supportive alternative to practicing alone or relying on a single speaking score. Warm illustrated environments and gentle character animation make space for repeated practice, with the goal of helping people develop their own communication style." },
      { heading: "Choose the setting for practice", body: "The interactive prototype offers Storytelling, Presentation, Conversation, and Interview environments. One-way or conversation style and reflection settings change the scene. A simulated recording timer leads into sample coaching moments, letting the practice-to-feedback journey be explored before real recording and AI analysis are built." },
    ],
    caseStudy: {
      sections: [
        { heading: "From a score to a useful next step", body: "Students preparing presentations, job seekers rehearsing interviews, and professionals improving everyday conversations often lack regular access to a coach. Communimate’s product direction connects feedback to specific moments in a response: what happened, how it could affect the listener, and one practical adjustment to try. The intended loop is simple: choose a goal, practice, review a few meaningful moments, and retry." },
        { heading: "Coaching that respects individual style", body: "The design prioritizes a few useful observations alongside strengths. Planned feedback considers the speaking situation, audience, and personal baseline rather than treating every accent or cultural difference as a mistake. A communicator persona is intended to reflect patterns that can evolve with practice. Pixel characters, a recurring lip motif, and calm environments give the experience a friendly identity without streak pressure or punitive scoring." },
        { heading: "Current stage and next milestone", body: "Communimate is currently an interactive interface prototype. Its timer, coaching moments, persona, and session history use sample data; it does not yet capture audio or video, analyze speech, or save progress. The next validation goal is a real 60–120 second one-way response, private recording storage, and three relevant coaching moments that help the user retry. Accounts, playback, timestamped evaluation, history, and deletion controls belong to that planned first version; live AI conversation remains a later direction." },
      ],
      capabilities: [
        "Four switchable practice environments with category-specific prompts and illustrated scenes.",
        "Session setup for interaction style and showing or hiding the illustrated reflection.",
        "A simulated start/finish recording flow that opens three sample coaching moments with observations, listener effects, and suggestions.",
        "A sample progress library with category filters, topic folders, repeated attempts, growth highlights, and a communicator persona.",
      ],
      contributions: [
        "Developing the product concept and practice–feedback–retry journey as an independent project.",
        "Exploring the visual identity, practice environments, contextual feedback, and progress experience through an interactive browser prototype.",
        "Defining the first-version scope around one-way speaking, actionable coaching, private recordings, and user control over stored sessions.",
      ],
    },
  },
  {
    slug: "mojo", title: "Mojo", year: "Ongoing",
    website: "https://mojo-eosin.vercel.app/",
    summary: "An Indonesian-language study companion prototype for UTBK/SNBT preparation, connecting a prerequisite-aware skill map with guided drills and practice at the learner’s own pace.",
    role: "System Design Infrastructure", tools: ["Next.js", "React", "TypeScript", "Neon PostgreSQL"], isPlaceholder: false, theme: "dark", presentation: "interface",
    coverImage: "/images/mojo.webp",
    coverAlt: "Mojo's dark learning interface showing a branching quantitative skill tree and progress panels",
    previewImage: "/images/mojo.webp",
    gallery: [
      { src: "/images/mojo/chatbot.webp", alt: "Mojo AI Agent screen explaining that the chatbot is not yet available, with a link to start practice instead", width: 3420, height: 2224, title: "Mojo Chatbot", caption: "The AI Agent introduces a planned study companion. In the pictured prototype, chat is explicitly unavailable; learners are directed to explore the Skill Tree and Drill experiences while the tutor is being prepared." },
      { src: "/images/mojo/drill.webp", alt: "Mojo Drill catalog with search, SNBT filters, and cards for Kuantitatif, Literasi, Penalaran, and Verbal", width: 3420, height: 2224, title: "Mojo Drill", caption: "The drill catalog groups practice into Kuantitatif, Literasi, Penalaran, and Verbal. Search and subject filters help learners find a starting point, with material and practice modes becoming available gradually." },
      { src: "/images/mojo/kuantitatif.webp", alt: "Kuantitatif drill list offering a whole-subject test and individual skills including Data and Probability, Numbers, Geometry, and Algebra, with availability labels", width: 3420, height: 2224, title: "Kuantitatif Drill List", caption: "Learners can choose an overall quantitative session or focus on one skill. The catalog connects practice to stable skill identifiers; the interface distinguishes available relaxed practice from topics that are still coming soon." },
      { src: "/images/mojo/modes.webp", alt: "Mojo Data and Probability practice mode cards showing Latihan Santai available and Latihan Dalam and Latihan Kelemahan marked coming soon", width: 3420, height: 2224, title: "Drill Mode", caption: "Three practice concepts offer different rhythms: Latihan Santai, Latihan Dalam, and Latihan Kelemahan. This screenshot shows relaxed practice available for Data & Peluang, with the other two choices marked as coming soon. Personalized weakness selection remains planned." },
      { src: "/images/mojo/practice.webp", alt: "Mojo relaxed quantitative practice session with a multiple-choice average question, answer-check control, no time limit, and a note that refreshing starts a new session", width: 3420, height: 2224, title: "Drill Mode Content", caption: "Relaxed practice presents locally generated quantitative questions without a timer, with answer checking and explanations. Templates can recur, and session counts stay in memory while the page is open; refreshing starts a new session rather than restoring a saved learning history." },
    ],
    detailContent: [
      { heading: "Practice for the UTBK journey", body: "Mojo supports Indonesian-speaking students preparing for UTBK/SNBT through an encouraging, low-pressure practice experience. Its prototype connects a skill map, subject and skill catalogs, question sessions, and explanatory feedback." },
      { heading: "See how skills connect", body: "A prerequisite-aware skill map helps learners understand how topics relate before choosing what to practice. The study flow carries that structure into subject browsing, focused skill selection, and available drill modes." },
    ],
    caseStudy: {
      capabilities: [
        "An interactive skill map with prerequisite relationships, subject filtering, and search.",
        "Subject and skill drill catalogs, including finite question sets loaded from Neon PostgreSQL.",
        "Locally generated relaxed practice for six quantitative skills, with answer checking and explanations.",
        "Prototype API endpoints for starting, answering, and completing finite drill attempts; combined subject sessions and relaxed practice do not persist attempts.",
      ],
      contributions: [
        "Designed the database structure for the learning and practice system.",
        "Connected application flows to the API layer.",
        "Defined the system flow connecting the skill map, drill catalog, and practice sessions.",
        "Considered future scaling as part of the system design and infrastructure planning.",
      ],
      sections: [
        { heading: "A clearer path through practice", body: "Mojo is an Indonesian-language study companion prototype for students preparing for UTBK/SNBT. Its prerequisite-aware map helps learners see how skills connect, then move into a subject catalog, choose a specific skill or an overall-subject session, and practice at an appropriate pace. The friendly tone and explanations are intended to make repeated study feel approachable." },
        { heading: "Current stage and next steps", body: "Mojo combines database-backed finite drills with locally generated relaxed practice. Its learner profile, mastery, streak, and XP displays are demo state, and the AI tutor is not available. Personalized weakness selection and durable relaxed-session history remain planned. Future scaling work needs to build on authenticated identity, ownership of attempts, a documented database schema, and a clear deployment model; no production scale or measured learning outcomes are claimed." },
      ],
    },
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
