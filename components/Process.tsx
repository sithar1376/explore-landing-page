import { MailCheck, MessageCircleMore, Send } from "lucide-react";

const steps = [
  {
    icon: Send,
    title: "Share Your Interest",
    copy: "Complete the short form and tell me a little about yourself.",
  },
  {
    icon: MessageCircleMore,
    title: "Let's Connect",
    copy: "I'll personally reach out through WhatsApp or email to arrange a convenient time.",
  },
  {
    icon: MailCheck,
    title: "Explore Together",
    copy: "We'll have a free 30–60-minute session shaped around your background and interests. Afterwards, I'll personally email your complimentary guide.",
  },
];

export function Process() {
  return (
    <section className="section process-section" aria-labelledby="process-title">
      <div className="shell">
        <div className="process-heading">
          <div>
            <p className="eyebrow eyebrow-light">SIMPLE AND PERSONAL</p>
            <h2 id="process-title">How We Can Connect</h2>
          </div>
          <p>
            A thoughtful next step—without pressure, artificial urgency, or promises of
            placements.
          </p>
        </div>
        <ol className="process-list">
          {steps.map(({ icon: Icon, title, copy }, index) => (
            <li key={title}>
              <span className="step-number">0{index + 1}</span>
              <Icon size={25} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
