import { Compass, HeartHandshake, Lightbulb, Route, UsersRound } from "lucide-react";

const benefits = [
  {
    icon: Compass,
    title: "Discover Where to Begin",
    copy: "Explore possible first steps toward dental and community health outreach.",
  },
  {
    icon: Lightbulb,
    title: "Learn From Real Experiences",
    copy: "Hear about firsthand experiences from dental outreach programs.",
  },
  {
    icon: Route,
    title: "Explore Ways to Contribute",
    copy: "Discuss how your interests and background can connect with outreach.",
  },
  {
    icon: UsersRound,
    title: "Connect Through Shared Purpose",
    copy: "Discover the value of connecting with people who care about community health.",
  },
  {
    icon: HeartHandshake,
    title: "Gain Clarity on Your Next Steps",
    copy: "Have a personal conversation about your interests and next steps.",
  },
];

export function Benefits() {
  return (
    <section className="section benefits-section" aria-labelledby="benefits-title">
      <div className="shell">
        <div className="section-heading centered-heading">
          <p className="eyebrow">A PERSONAL CONVERSATION</p>
          <h2 id="benefits-title">What Can We Explore Together?</h2>
        </div>
        <div className="benefits-grid">
          {benefits.map(({ icon: Icon, title, copy }, index) => (
            <article className="benefit-card" key={title}>
              <div className="benefit-topline">
                <span>0{index + 1}</span>
                <Icon size={23} strokeWidth={1.8} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
