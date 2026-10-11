"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, MessageCircle, Video } from "lucide-react";

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919740279698";
const whatsappMessage =
  "Hi Sithar, I just submitted the connection form through SmileWithSithar. I'm looking forward to connecting and learning about the next steps.";
const vimeoUrl = process.env.NEXT_PUBLIC_VIMEO_URL?.trim() || "";
const configuredVimeoId = vimeoUrl.match(/(?:video\/|vimeo\.com\/)(\d+)/)?.[1];
const configuredVimeoHash =
  vimeoUrl.match(/[?&]h=([a-zA-Z0-9]+)/)?.[1] ||
  vimeoUrl.match(/vimeo\.com\/\d+\/([a-zA-Z0-9]+)/)?.[1];
const vimeoEmbedUrl = configuredVimeoId
  ? `https://player.vimeo.com/video/${configuredVimeoId}${configuredVimeoHash ? `?h=${configuredVimeoHash}` : ""}`
  : "https://player.vimeo.com/video/76979871?h=8272103f6e";
const vimeoPlayerUrl = `${vimeoEmbedUrl}${vimeoEmbedUrl.includes("?") ? "&" : "?"}autoplay=0&dnt=1&title=0&byline=0&portrait=0`;

export function ThankYouContent() {
  const [view, setView] = useState<"checking" | "guarded" | "confirmed" | "preview">(
    "checking",
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isDevelopmentPreview =
      process.env.NODE_ENV === "development" && params.get("preview") === "design";
    if (isDevelopmentPreview) {
      setView("preview");
      return;
    }

    const hasSuccessMarker = params.get("submitted") === "1";
    const hasSessionConfirmation =
      sessionStorage.getItem("smilewithsithar:connection-submitted") === "confirmed";
    setView(hasSuccessMarker && hasSessionConfirmation ? "confirmed" : "guarded");
  }, []);

  if (view === "checking") {
    return (
      <main className="thank-you-main" id="main-content">
        <div className="thank-you-card status-card" role="status">
          <div className="status-orbit" aria-hidden="true" />
          <p>Checking your submission status…</p>
        </div>
      </main>
    );
  }

  if (view === "guarded") {
    return (
      <main className="thank-you-main" id="main-content">
        <section className="thank-you-card direct-visit-card" aria-labelledby="direct-visit-title">
          <p className="eyebrow">MEANINGFUL OUTREACH</p>
          <h1 id="direct-visit-title">Ready to Start a Meaningful Conversation?</h1>
          <p>
            This page confirms a request only after the connection form has been successfully
            accepted. If you&apos;d like to connect with Sithar, please begin with the short form.
          </p>
          <a className="button button-primary" href="/#connection-form">
            <ArrowLeft size={18} aria-hidden="true" /> Go to the Connection Form
          </a>
        </section>
      </main>
    );
  }

  const isPreview = view === "preview";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="thank-you-main" id="main-content">
      <section className="thank-you-card" aria-labelledby="thank-you-title">
        {isPreview && (
          <div className="development-preview-note" role="status">
            <Eye size={18} aria-hidden="true" />
            <span>
              <strong>Development design preview</strong>
              No form was submitted and no inquiry was received. The production safeguard remains
              active.
            </span>
          </div>
        )}
        <div className="success-icon" aria-hidden="true">
          <CheckCircle2 size={34} />
        </div>
        <p className="eyebrow">{isPreview ? "THANK-YOU PAGE PREVIEW" : "REQUEST ACCEPTED"}</p>
        <h1 id="thank-you-title">Thank You for Reaching Out!</h1>
        <div className="thank-you-message">
          <p>I&apos;m looking forward to connecting with you!</p>
          <p>
            I&apos;ll personally contact you through WhatsApp or email to arrange our free discovery
            session.
          </p>
          <p>After our conversation, you&apos;ll receive your complimentary outreach guide.</p>
          <p className="signature">
            Warm regards,
            <br />
            <strong>Sithar</strong>
            <br />
            <span>Serve. Explore. Connect. Refresh.</span>
          </p>
        </div>

        {vimeoEmbedUrl && (
          <div className="video-section">
            <div className="video-heading">
              <Video size={20} aria-hidden="true" />
              <div className="video-heading-copy">
                <h2>Before You Go</h2>
                <p>Watch This Video.</p>
              </div>
            </div>
            <div className="video-frame">
              <iframe
                src={vimeoPlayerUrl}
                title="Before You Go video"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        )}

        {isPreview ? (
          <span className="button whatsapp-button preview-disabled" aria-disabled="true">
            <MessageCircle size={19} aria-hidden="true" /> Connect With Me on WhatsApp
          </span>
        ) : (
          <a
            className="button whatsapp-button"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={19} aria-hidden="true" /> Connect With Me on WhatsApp
          </a>
        )}
      </section>
    </main>
  );
}
