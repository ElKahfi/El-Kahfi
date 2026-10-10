import Link from "next/link";
import { Arrow } from "./Arrow";

export function Footer() {
  return (
    <footer id="about" className="footer">
      <div className="footer-intro"><span className="eyebrow">About the portfolio</span><h2>Systems.<br /><span>Connections.</span><br />Possibilities.</h2><p>ELKAHFI — System Design.<br />Selected work in cybersecurity training, communication practice, and UTBK learning.</p></div>
      <div className="footer-bottom"><Link className="wordmark" href="/">ELKAHFI</Link><span className="eyebrow">System Design / Portfolio</span><a href="#top" className="back-top">Back to top <Arrow /></a></div>
    </footer>
  );
}
