import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ELKAHFI — System Design", template: "%s — ELKAHFI" },
  description: "The personal portfolio of ELKAHFI. System Design, projects, and the connections between them.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>;
}
