import type { ProjectImage } from "./projects";

export type UniversityProject = {
  slug: string;
  title: string;
  discipline: string;
  summary: string;
  role: string;
  tools: string[];
  image: ProjectImage;
  imageCaption: string;
  sections: { heading: string; body: string }[];
  links: { label: string; href: string }[];
};

// Sources: owner descriptions and screenshots, Copyin report/assignment and
// Drive folder, Figma files, and the accessible TukaKu Canva presentation.
// No implementation stack, measured results, or individual tasks are inferred.
export const universityProjects: UniversityProject[] = [
  {
    slug: "copyin",
    title: "Copyin",
    discipline: "Systems analysis & interface design",
    summary: "A mobile service concept bringing document printing, photocopying, and stationery orders into one journey, connecting customers with nearby outlets.",
    role: "Team Leader",
    tools: ["Figma", "draw.io"],
    image: { src: "/images/university/copyin.webp", alt: "Copyin mobile interface designs showing home recommendations, a stationery shop catalog, and a pencil product detail screen", width: 1136, height: 772 },
    imageCaption: "Customer interface designs — discovering shops, browsing stationery, and reviewing a product before adding it to the cart.",
    sections: [
      { heading: "Print and stationery, together", body: "The university brief addresses the effort of visiting separate shops for printing, photocopies, and stationery. Copyin’s proposed customer journey brings shop discovery, file submission, print specifications, product selection, delivery details, and order history into one mobile service." },
      { heading: "Connecting the interface to the system", body: "The Information Systems Analysis and Design project documents the service through fishbone analysis, use cases, data flow, class, sequence, state transition, and activity diagrams. The report also covers input and output designs and a proposed client/server architecture. Customer ordering is paired with administrator workflows for stationery catalogs and monthly printing and sales reports." },
    ],
    links: [
      { label: "Project report", href: "https://docs.google.com/document/d/1wu2iJ0-XDP1CkNdKRud0VPktVT2JW-8mMYNlK4P2ltI/edit?usp=sharing" },
      { label: "Project files", href: "https://drive.google.com/drive/folders/10MOOpW61pGjxqEfDjXw50tE8O6SxNwum?usp=sharing" },
      { label: "Figma design", href: "https://www.figma.com/design/pu14tr8bAesudMSB7cwgq7/Kelompok-13----Projek-ISAD-LAB-Copyin?node-id=0-1" },
    ],
  },
  {
    slug: "tukaku",
    title: "TukaKu",
    discipline: "Digital service & interface design",
    summary: "A digital service concept connecting people who need repairs or maintenance with tradespeople, making it easier to find suitable help and understand the price before booking.",
    role: "Team Leader",
    tools: ["Figma", "Canva"],
    image: { src: "/images/university/tukaku.webp", alt: "TukaKu interface overview with landing, login, tradesperson listings, booking, payment, order history, messaging, and profile designs", width: 1922, height: 1304 },
    imageCaption: "Service interface overview — from finding a tradesperson and reviewing their profile to booking, payments, and order history.",
    sections: [
      { heading: "Finding the right help", body: "TukaKu responds to the difficulty of finding reliable tradespeople through a manual search, especially when prices, schedules, and work quality are unclear. The concept helps customers find repair and maintenance services suited to their needs while giving tradespeople a broader place to offer their skills." },
      { heading: "A clearer path to booking", body: "The presentation and interface designs explore tradesperson profiles, ratings and reviews, service selection, booking details, and payment options. Supporting screens cover account access, order history, messaging, and profile management. These materials present the proposed service journey and its interface design." },
    ],
    links: [
      { label: "Project presentation", href: "https://www.canva.com/design/DAG1mNoXY6U/sasUpzfUx7O78YP-cm-cng/edit" },
      { label: "Figma prototype", href: "https://www.figma.com/proto/JMUcBCsAIMYtEhnv8iYSsZ/TukaKu?node-id=1-9&starting-point-node-id=1%3A9" },
    ],
  },
  {
    slug: "batikeryday",
    title: "Batikeryday",
    discipline: "Fashion concept & garment prototyping",
    summary: "A casual fashion concept exploring how batik can become part of everyday wardrobes for Gen Z and younger people.",
    role: "Team Leader",
    tools: ["CLO", "Canva"],
    image: { src: "/images/university/batikeryday.webp", alt: "Batikeryday CLO garment prototype showing two-dimensional sewing patterns and front, back, and side views of a notched-collar batik shirt with wide-leg trousers", width: 2908, height: 1644 },
    imageCaption: "Notched Collar Batik — garment patterns alongside front, back, and side views of the digital outfit prototype.",
    sections: [
      { heading: "Batik for everyday wear", body: "Batikeryday explores a casual direction for batik aimed at younger wearers. The concept places batik within everyday outfits, with a focus on clothing that fits a contemporary wardrobe." },
      { heading: "From pattern to digital outfit", body: "The supplied CLO image shows a Notched Collar Batik prototype with two-dimensional garment patterns and several views of the assembled outfit. A short-sleeved batik shirt is paired with wide-leg trousers, showing how the pattern and silhouette work together in the digital garment study." },
    ],
    links: [
      { label: "Project presentation", href: "https://canva.link/p9ssay2hu4tal0i" },
    ],
  },
];
