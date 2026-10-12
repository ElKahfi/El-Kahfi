import Link from "next/link";
import { Arrow } from "./Arrow";

export function Footer() {
  return (
    <footer className="footer about-footer">

      <div className="footer-bottom"><Link className="wordmark" href="/">ELKAHFI</Link><span className="eyebrow">System Design / Portfolio</span><a href="#top" className="back-top">Back to top <Arrow /></a></div>
    </footer>
  );
}
