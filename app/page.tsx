import { ArrowRight } from "lucide-react";
import { Benefits } from "@/components/Benefits";
import { CTAForm } from "@/components/CTAForm";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />

        <section className="section problem-section" aria-labelledby="problem-title">
          <div className="shell problem-grid">
            <div>
              <p className="eyebrow eyebrow-light">A SIMPLE PLACE TO START</p>
              <h2 id="problem-title">Interested in Outreach, but Not Sure Where to Begin?</h2>
            </div>
            <div className="problem-copy">
              <p>
                You may feel inspired to contribute to community health but unsure where to
                start. Perhaps you&apos;re curious about dental outreach, volunteering, or meeting
                others who share your interests.
              </p>
              <blockquote>
                Sometimes, a meaningful journey begins with a simple conversation.
              </blockquote>
            </div>
          </div>
        </section>

        <Benefits />
        <Process />

        <section className="section invitation-section" aria-labelledby="invitation-title">
          <div className="shell invitation-card">
            <div>
              <p className="eyebrow">AN OPEN INVITATION</p>
              <h2 id="invitation-title">Every Meaningful Connection Begins Somewhere.</h2>
              <p>
                You don&apos;t need to have everything figured out. If you&apos;re curious about
                dental or community health outreach, I&apos;d be happy to connect, share
                experiences, and explore possibilities together.
                <br />
                <br />
                Wherever you are in the world, if you believe in meaningful community health
                outreach, I&apos;d be happy to connect.
              </p>
            </div>
            <a className="button button-dark" href="#connection-form">
              Let&apos;s Connect With Purpose <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        <CTAForm />
      </main>
      <Footer />
    </>
  );
}
