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

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let input: ContactRequest;

  try {
    input = (await request.json()) as ContactRequest;
  } catch {
    return Response.json(
      { success: false, message: "The form request was invalid. Please try again." },
      { status: 400 },
    );
  }

  const company = readString(input.company);
  if (company) {
    return Response.json({ success: true });
  }

  const name = readString(input.name);
  const email = readString(input.email);
  const whatsapp = readString(input.whatsapp);
  const whatsappCountry = readString(input.whatsapp_country);

  if (!name || !email || !whatsapp || !whatsappCountry) {
    return Response.json(
      { success: false, message: "Please complete all required fields and try again." },
      { status: 400 },
    );
  }

  const configuredEndpoint =
    process.env.FORMSUBMIT_ENDPOINT ||
    process.env.NEXT_PUBLIC_FORMSUBMIT_ENDPOINT ||
    "https://formsubmit.co/sithar1376@gmail.com";
  const endpoint = configuredEndpoint.replace(
    "https://formsubmit.co/ajax/",
    "https://formsubmit.co/",
  );
  const origin = new URL(request.url).origin;
  const formData = new URLSearchParams({
    name,
    email,
    whatsapp,
    whatsapp_country: whatsappCountry,
    profession_or_organization: readString(input.profession_or_organization),
    website_or_facebook: readString(input.website_or_facebook),
    message: readString(input.message),
    _subject: "New SmileWithSithar Connection Request",
    _template: "table",
    _captcha: "false",
  });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "text/html",
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: origin,
        Referer: `${origin}/`,
      },
      body: formData.toString(),
      cache: "no-store",
      signal: AbortSignal.timeout(45_000),
    });
    const responseBody = await response.text();
    const accepted =
      response.ok &&
      (responseBody.includes("The form was submitted successfully") ||
        /<h1>\s*Thanks!\s*<\/h1>/i.test(responseBody));

    if (!accepted) {
      return Response.json(
        {
          success: false,
          message: "The form service did not accept your request. Please try again shortly.",
        },
        { status: 502 },
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      {
        success: false,
        message: "The form service could not be reached. Please try again shortly.",
      },
      { status: 504 },
    );
  }
}
