export type ProjectImage = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  title: string;
  year: number | null;
  summary: string;
  role: string | null;
  tools: string[];
  coverImage: string;
  coverAlt: string;
  presentation: "mascot" | "interface";
  previewImage: string;
  previewVideo?: string;
  gallery: ProjectImage[];
  detailContent: { heading: string; body: string }[];
  isPlaceholder: boolean;
  theme: "light" | "dark";
};

// Owner-supplied descriptions. Unknown metadata stays empty. Screenshots do not
// establish measured outcomes, implementation tools, or individual responsibilities.
export const projects: Project[] = [
  {
    slug: "sentri", title: "Sentri", year: 2026,
    summary: "A human-centric cybersecurity training service designed to help people recognize unsafe patterns and improve everyday security behavior.",
    role: null, tools: [], isPlaceholder: false, theme: "light", presentation: "mascot",
    coverImage: "/images/sentri-mascot.webp",
    coverAlt: "Sentri's friendly pixel-art robot mascot in a green cape",
    previewImage: "/images/sentri-poster.webp",
    previewVideo: "/media/sentri-preview.mp4",
    gallery: [
      { src: "/images/sentri-console.webp", alt: "Sentri dispatch console with an email investigation queue, task details, and the mascot guide", width: 1628, height: 902 },
      { src: "/images/sentri-mascot.webp", alt: "Sentri mascot waving, with cyan eyes, a shield emblem, and a green cape", width: 1144, height: 1375 },
    ],
    detailContent: [
      { heading: "Security starts with everyday behavior", body: "Sentri puts people at the center of cybersecurity training. Its aim is to help people notice unsafe patterns and build safer habits in everyday decisions." },
      { heading: "A place to practice decisions", body: "The dispatch console presents a queue of tasks alongside the details needed to investigate them. The supplied interface shows email investigation, password review, and data classification as training areas." },
      { heading: "A human presence in the interface", body: "The Sentri mascot accompanies the console experience. The friendly character and illustrated workspace give the training a recognizable visual identity." },
    ],
  },
  {
    slug: "communimate", title: "Communimate", year: null,
    summary: "A communication-improvement product that helps people identify speech weaknesses and discover communication methods that suit them best.",
    role: null, tools: [], isPlaceholder: false, theme: "light", presentation: "interface",
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
