import Image from "next/image";
import { ArrowDown, BookOpen, Clock3 } from "lucide-react";

export function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="shell hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">DENTAL OUTREACH · COMMUNITY HEALTH · CONNECTION</p>
          <h1 id="hero-title">
            <span className="hero-heading-primary">Explore Meaningful Outreach.</span>{" "}
            <span className="hero-heading-secondary">Connect With Purpose.</span>
          </h1>
          <div className="hero-lede">
            <p>
              Interested in dental and community health outreach? Let&apos;s connect, share
              experiences, and explore meaningful ways to contribute.
            </p>
            <p>
              Join Sithar for a free 30–60-minute discovery session to share your interests,
              ask questions, and find a meaningful way forward.
            </p>
          </div>
          <div className="hero-guide-copy">
            <p>After our conversation, you&apos;ll receive a complimentary PDF guide:</p>
            <strong>&ldquo;Be Part of a Meaningful Dental Outreach Journey&rdquo;</strong>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="#connection-form">
              Let&apos;s Connect With Purpose <ArrowDown size={18} aria-hidden="true" />
            </a>
            <span className="session-note">
              <Clock3 size={18} aria-hidden="true" /> Free · Personal · 30–60 Minutes
            </span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Sithar and the complimentary outreach guide">
          <figure className="portrait-card">
            <Image
              src="/sithar-outreach.jpg"
              alt="Sithar with children during a community outreach visit"
              width={2200}
              height={1237}
              priority
            />
            <figcaption>
              <span>Practicing dentist · Outreach volunteer</span>
            </figcaption>
          </figure>
          <figure className="guide-card">
            <div className="guide-label">
              <BookOpen size={16} aria-hidden="true" /> Complimentary post-session guide
            </div>
            <Image
              src="/guide-cover.png"
              alt="Cover of Be Part of a Meaningful Dental Outreach Journey"
              width={1279}
              height={1809}
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
