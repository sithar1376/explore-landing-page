import { parsePhoneNumberFromString } from "libphonenumber-js";

type ContactRequest = {
  name?: unknown;
  email?: unknown;
  whatsapp?: unknown;
  whatsapp_country?: unknown;
  profession_or_organization?: unknown;
  website_or_facebook?: unknown;
  message?: unknown;
  company?: unknown;
};

export const runtime = "nodejs";
export const maxDuration = 60;

const providerTimeoutMs = 50_000;
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://explore.smilewithsithar.com"
).replace(/\/$/, "");
const formUrl = `${siteUrl}/`;

function readString(value: unknown, maximumLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maximumLength) : "";
}

function isValidEmail(value: string) {
  const atIndex = value.lastIndexOf("@");
  return (
    atIndex > 0 &&
    atIndex < value.length - 1 &&
    value.length <= 254 &&
    !/\s/.test(value) &&
    value.slice(atIndex + 1).includes(".")
  );
}

function isValidOptionalUrl(value: string) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isConfirmedFormSubmitSuccess(responseBody: string) {
  return (
    /the form was submitted successfully/i.test(responseBody) ||
    /<h1[^>]*>\s*thanks!\s*<\/h1>/i.test(responseBody)
  );
}

function jsonResponse(
  body: {
    accepted: boolean;
    deliveryConfirmed: false;
    code: string;
    message: string;
  },
  status = 200,
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin");
  const endpointOrigin = new URL(request.url).origin;
  if (requestOrigin && requestOrigin !== endpointOrigin && requestOrigin !== siteUrl) {
    return jsonResponse(
      {
        accepted: false,
        deliveryConfirmed: false,
        code: "origin_not_allowed",
        message: "This submission origin is not allowed.",
      },
      403,
    );
  }

  let input: ContactRequest;
  try {
    input = (await request.json()) as ContactRequest;
  } catch {
    return jsonResponse(
      {
        accepted: false,
        deliveryConfirmed: false,
        code: "invalid_request",
        message: "The form request was invalid. Please try again.",
      },
      400,
    );
  }

  const company = readString(input.company, 200);
  if (company) {
    return jsonResponse(
      {
        accepted: false,
        deliveryConfirmed: false,
        code: "request_not_accepted",
        message: "The request could not be accepted.",
      },
      400,
    );
  }

  const name = readString(input.name, 120);
  const email = readString(input.email, 254).normalize("NFC");
  const whatsapp = readString(input.whatsapp, 32);
  const whatsappCountry = readString(input.whatsapp_country, 2).toUpperCase();
  const profession = readString(input.profession_or_organization, 160);
  const website = readString(input.website_or_facebook, 500);
  const message = readString(input.message, 5_000);
  const phoneNumber = parsePhoneNumberFromString(whatsapp, { extract: false });

  if (
    !name ||
    !isValidEmail(email) ||
    !whatsappCountry ||
    !phoneNumber?.isValid() ||
    !isValidOptionalUrl(website)
  ) {
    return jsonResponse(
      {
        accepted: false,
        deliveryConfirmed: false,
        code: "validation_failed",
        message: "Please check the required fields and try again.",
      },
      400,
    );
  }

  const configuredEndpoint =
    process.env.FORMSUBMIT_ENDPOINT ||
    process.env.NEXT_PUBLIC_FORMSUBMIT_ENDPOINT ||
    "https://formsubmit.co/sithar1376@gmail.com";
  const providerEndpoint = configuredEndpoint.replace(
    "https://formsubmit.co/ajax/",
    "https://formsubmit.co/",
  );
  const providerBody = new URLSearchParams({
    name,
    email,
    whatsapp: phoneNumber.number,
    whatsapp_country: whatsappCountry,
    profession_or_organization: profession,
    website_or_facebook: website,
    message,
    _subject: "New SmileWithSithar Connection Request",
    _template: "table",
    _captcha: "false",
    _url: formUrl,
  });
  const browserUserAgent =
    readString(request.headers.get("user-agent"), 500) ||
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Safari/605.1.15";
  const startedAt = Date.now();

  try {
    const providerResponse = await fetch(providerEndpoint, {
      method: "POST",
      headers: {
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Origin: siteUrl,
        Referer: formUrl,
        "User-Agent": browserUserAgent,
      },
      body: providerBody.toString(),
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(providerTimeoutMs),
    });
    const responseBody = await providerResponse.text();
    const accepted =
      providerResponse.ok && isConfirmedFormSubmitSuccess(responseBody);

    if (!accepted) {
      console.error("FormSubmit did not confirm acceptance", {
        status: providerResponse.status,
        durationMs: Date.now() - startedAt,
        contentType: providerResponse.headers.get("content-type"),
        responseBytes: responseBody.length,
      });
      return jsonResponse(
        {
          accepted: false,
          deliveryConfirmed: false,
          code: "provider_rejected",
          message: "The form service did not confirm acceptance. Please try again shortly.",
        },
        502,
      );
    }

    return jsonResponse({
      accepted: true,
      deliveryConfirmed: false,
      code: "accepted",
      message:
        "The form service accepted the request. Email delivery is handled separately by FormSubmit.",
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    console.error("FormSubmit request failed", {
      code: timedOut ? "provider_timeout" : "provider_unreachable",
      durationMs: Date.now() - startedAt,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return jsonResponse(
      {
        accepted: false,
        deliveryConfirmed: false,
        code: timedOut ? "provider_timeout" : "provider_unreachable",
        message: timedOut
          ? "The form service took too long to respond. Please try again shortly."
          : "The form service could not be reached. Please try again shortly.",
      },
      timedOut ? 504 : 502,
    );
  }
}
