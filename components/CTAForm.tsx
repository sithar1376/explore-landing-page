"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ArrowRight, Check, LoaderCircle, ShieldCheck } from "lucide-react";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { InternationalPhoneField } from "./InternationalPhoneField";

type Values = {
  fullName: string;
  email: string;
  whatsappCountry: string;
  whatsapp: string;
  profession: string;
  website: string;
  message: string;
  company: string;
};

type Errors = Partial<Record<keyof Values, string>>;

const initialValues: Values = {
  fullName: "",
  email: "",
  whatsappCountry: "",
  whatsapp: "",
  profession: "",
  website: "",
  message: "",
  company: "",
};

const configuredEndpoint =
  process.env.NEXT_PUBLIC_FORMSUBMIT_ENDPOINT ||
  "https://formsubmit.co/sithar1376@gmail.com";
const endpoint = configuredEndpoint.replace("https://formsubmit.co/ajax/", "https://formsubmit.co/");
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://explore.smilewithsithar.com"
).replace(/\/$/, "");
const thankYouUrl = `${siteUrl}/thank-you?submitted=1`;

function isValidUrl(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidInternationalEmail(value: string) {
  const email = value.trim().normalize("NFC");
  const atIndex = email.lastIndexOf("@");
  if (atIndex <= 0 || atIndex === email.length - 1 || /\s/.test(email)) return false;

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  if (localPart.length > 64 || domain.length > 253 || !domain.includes(".")) return false;

  try {
    const hostname = new URL(`http://${domain}`).hostname;
    return hostname.includes(".") && !hostname.startsWith(".") && !hostname.endsWith(".");
  } catch {
    return false;
  }
}

function getInternationalWhatsApp(country: string, nationalNumber: string) {
  if (!country || !nationalNumber.trim() || nationalNumber.trim().startsWith("+")) return null;
  const phoneNumber = parsePhoneNumberFromString(nationalNumber.trim(), {
    defaultCountry: country as CountryCode,
    extract: false,
  });
  return phoneNumber?.isValid() ? phoneNumber.number : null;
}

export function CTAForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  function update(field: keyof Values, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      ...(field === "whatsappCountry" ? { whatsapp: undefined } : {}),
    }));
  }

  function validate() {
    const next: Errors = {};
    if (!values.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!isValidInternationalEmail(values.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!values.whatsappCountry) {
      next.whatsapp = "Please choose your country or calling code.";
    } else if (!getInternationalWhatsApp(values.whatsappCountry, values.whatsapp)) {
      next.whatsapp = "Please enter a valid phone number for the selected country.";
    }
    if (!isValidUrl(values.website)) {
      next.website = "Please enter a complete URL beginning with http:// or https://.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading" || values.company) {
      return;
    }
    if (!validate()) {
      setStatus("error");
      setStatusMessage("Please check the highlighted fields and try again.");
      return;
    }

    setStatus("loading");
    setStatusMessage("");
    const internationalWhatsApp = getInternationalWhatsApp(
      values.whatsappCountry,
      values.whatsapp,
    );
    if (!internationalWhatsApp) {
      setStatus("error");
      setStatusMessage("Please check your country code and WhatsApp number.");
      return;
    }

    const payload = {
      name: values.fullName.trim(),
      email: values.email.trim(),
      whatsapp: internationalWhatsApp,
      whatsapp_country: values.whatsappCountry,
      profession_or_organization: values.profession.trim(),
      website_or_facebook: values.website.trim(),
      message: values.message.trim(),
      company: values.company,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;
      if (!response.ok || result?.success !== true) {
        throw new Error(result?.message || "Your request could not be sent.");
      }

      sessionStorage.setItem("smilewithsithar:connection-submitted", "confirmed");
      router.push("/thank-you?submitted=1");
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Your request could not be sent. Please try again.",
      );
    }
  }

  const internationalWhatsApp =
    getInternationalWhatsApp(values.whatsappCountry, values.whatsapp) || "";

  return (
    <section className="section form-section" id="connection-form" aria-labelledby="form-title">
      <div className="shell form-layout">
        <div className="form-intro">
          <p className="eyebrow">YOUR NEXT STEP</p>
          <h2 id="form-title">Start a Meaningful Conversation</h2>
          <p className="form-intro-copy">
            Tell me what inspires your interest in outreach. I&apos;ll personally reach out by
            WhatsApp or email to arrange your free 30–60-minute Meaningful Outreach Discovery
            Session.
          </p>
          <div className="guide-promise">
            <span className="guide-promise-icon">
              <Check size={20} aria-hidden="true" />
            </span>
            <div>
              <strong>A Conversation With Purpose</strong>
              <p>
                Every meaningful connection begins with a conversation.
                <br />
                <br />
                Together, we&apos;ll explore your interests, questions, and possible ways to
                contribute to dental and community health outreach.
                <br />
                <br />
                After our discovery session, I&apos;ll share a complimentary PDF guide to help you
                continue exploring your journey.
              </p>
            </div>
          </div>
          <p className="privacy-line">
            <ShieldCheck size={18} aria-hidden="true" /> We respect your privacy. No spam.
          </p>
        </div>

        <form
          className="connection-form"
          action={endpoint}
          method="POST"
          onSubmit={submit}
          noValidate
          aria-busy={status === "loading"}
        >
          <input type="hidden" name="whatsapp" value={internationalWhatsApp} />
          <input type="hidden" name="whatsapp_country" value={values.whatsappCountry} />
          <input type="hidden" name="_subject" value="New SmileWithSithar Connection Request" />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_next" value={thankYouUrl} />
          <div className="form-grid">
            <Field label="Full Name" id="full-name" required error={errors.fullName}>
              <input
                id="full-name"
                name="name"
                autoComplete="name"
                value={values.fullName}
                onChange={(event) => update("fullName", event.target.value)}
                placeholder="Your full name"
                aria-invalid={Boolean(errors.fullName)}
                aria-describedby={errors.fullName ? "full-name-error" : undefined}
              />
            </Field>
            <Field label="Active Email" id="email" required error={errors.email}>
              <input
                id="email"
                name="email"
                type="text"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </Field>
            <InternationalPhoneField
              country={values.whatsappCountry}
              number={values.whatsapp}
              error={errors.whatsapp}
              onCountryChange={(country) => update("whatsappCountry", country)}
              onNumberChange={(number) => update("whatsapp", number)}
            />
            <Field label="Profession / Organization" id="profession" hint="Optional">
              <input
                id="profession"
                name="profession_or_organization"
                autoComplete="organization"
                value={values.profession}
                onChange={(event) => update("profession", event.target.value)}
                placeholder="Dentist, student, volunteer…"
              />
            </Field>
            <Field
              label="Website or Facebook URL"
              id="website"
              hint="Optional"
              error={errors.website}
            >
              <input
                id="website"
                name="website_or_facebook"
                type="url"
                autoComplete="url"
                value={values.website}
                onChange={(event) => update("website", event.target.value)}
                placeholder="https://"
                aria-invalid={Boolean(errors.website)}
                aria-describedby={errors.website ? "website-error" : undefined}
              />
            </Field>
            <Field label="Anything You Want to Say" id="message" hint="Optional" wide>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={values.message}
                onChange={(event) => update("message", event.target.value)}
                placeholder="Tell me what interests you about outreach…"
              />
            </Field>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="_honey"
                tabIndex={-1}
                autoComplete="off"
                value={values.company}
                onChange={(event) => update("company", event.target.value)}
              />
            </div>
          </div>

          {status === "error" && (
            <div className="form-status" role="alert">
              <AlertCircle size={18} aria-hidden="true" />
              <span>{statusMessage}</span>
            </div>
          )}

          <button className="button button-primary submit-button" type="submit" disabled={status === "loading"}>
            {status === "loading" ? (
              <>
                <LoaderCircle className="spin" size={18} aria-hidden="true" /> Sending…
              </>
            ) : (
              <>
                Let&apos;s Connect! <ArrowRight size={18} aria-hidden="true" />
              </>
            )}
          </button>
          <p className="submission-note">
            By submitting this form, you&apos;re expressing interest in connecting with Sithar.
            I&apos;ll personally reach out to arrange a suitable time.
          </p>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  required,
  hint,
  error,
  wide,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  error?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`field ${wide ? "field-wide" : ""}`}>
      <label htmlFor={id}>
        {label} {required && <span aria-hidden="true">*</span>}
        {hint && <small>{hint}</small>}
      </label>
      {children}
      {error && (
        <span className="field-error" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  );
}
