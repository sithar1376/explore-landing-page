from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


SOURCE = Path("/Users/amber/Downloads/lead magnet final final.pdf")
OUTPUT = Path("output/pdf/SmileWithSithar_Meaningful_Dental_Outreach_Journey.pdf")

FONT_DIR = Path(
    "/Users/amber/.cache/codex-runtimes/codex-primary-runtime/dependencies/"
    "native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/"
    "Resources/fonts/truetype"
)

PAGE_WIDTH = 595
PAGE_HEIGHT = 842
LEFT = 61
CONTENT_WIDTH = 473

BACKGROUND = HexColor("#FFF9F1")
BODY = Color(0.196078, 0.282353, 0.290196)
TEAL = Color(0.105882, 0.341176, 0.356863)


def draw_paragraph(c: canvas.Canvas, text: str, top: float, style: ParagraphStyle) -> float:
    paragraph = Paragraph(text, style)
    _, height = paragraph.wrap(CONTENT_WIDTH, PAGE_HEIGHT)
    paragraph.drawOn(c, LEFT, PAGE_HEIGHT - top - height)
    return top + height


def build_replacement_page() -> PdfReader:
    pdfmetrics.registerFont(TTFont("DejaVu", FONT_DIR / "DejaVuSans.ttf"))
    pdfmetrics.registerFont(TTFont("DejaVu-Bold", FONT_DIR / "DejaVuSans-Bold.ttf"))

    stream = BytesIO()
    c = canvas.Canvas(stream, pagesize=(PAGE_WIDTH, PAGE_HEIGHT))

    # Rebuild page 7 so the outdated offer is removed from the PDF's searchable
    # text as well as from its visible design.
    c.setFillColor(BACKGROUND)
    c.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)
    c.setFillColor(HexColor("#F6DFE2"))
    c.roundRect(38, 774, 519, 12, 6, stroke=0, fill=1)

    heading = ParagraphStyle(
        "heading",
        fontName="DejaVu-Bold",
        fontSize=10.2,
        leading=13,
        textColor=TEAL,
        spaceAfter=0,
    )
    body = ParagraphStyle(
        "body",
        fontName="DejaVu",
        fontSize=9.1,
        leading=14.6,
        textColor=BODY,
        spaceAfter=0,
    )
    centered = ParagraphStyle(
        "centered",
        parent=body,
        alignment=TA_CENTER,
        textColor=TEAL,
        leading=16,
    )
    centered_bold = ParagraphStyle(
        "centered-bold",
        parent=centered,
        fontName="DejaVu-Bold",
        fontSize=9.2,
    )

    page_title = ParagraphStyle(
        "page-title",
        fontName="DejaVu-Bold",
        fontSize=16,
        leading=20,
        textColor=TEAL,
        spaceAfter=0,
    )

    draw_paragraph(c, "07 | Let's Connect &amp; Make a Difference", 97, page_title)
    draw_paragraph(
        c,
        "Every meaningful journey begins with a connection. Through "
        "SmileWithSithar, I hope to meet dental professionals, healthcare "
        "workers, volunteers, and supporters who share an interest in "
        "compassionate, responsible community service.",
        130,
        body,
    )

    draw_paragraph(c, "A meaningful discovery session", 184, heading)
    draw_paragraph(
        c,
        "Request a free 30-60-minute Meaningful Outreach Discovery Session. "
        "Our conversation will be personalized to your background, interests, "
        "and questions. Together, we can explore dental or broader community "
        "health outreach and discuss practical first steps relevant to you.",
        204,
        body,
    )

    draw_paragraph(c, "What happens after our session?", 270, heading)
    draw_paragraph(
        c,
        "After the completed conversation, I will personally email you this "
        "complimentary guide, <i>Be Part of a Meaningful Dental Outreach "
        "Journey</i>. The conversation is personalized, while the guide remains "
        "a universal introduction for dental professionals, healthcare workers, "
        "volunteers, and supporters.",
        290,
        body,
    )

    draw_paragraph(c, "Visit SmileWithSithar", 346, centered)
    draw_paragraph(c, "smilewithsithar.com", 362, centered)
    draw_paragraph(c, "Request Your Free Discovery Session", 385, centered_bold)

    draw_paragraph(
        c,
        "A note on expectations: SmileWithSithar is a personal "
        "experience-sharing platform, not a mission organizer, volunteer "
        "placement service, fundraising organization, or formal AI consultancy. "
        "Conversations are informal and do not guarantee placements, "
        "sponsorships, or collaborations.",
        414,
        body,
    )
    draw_paragraph(
        c,
        "&ldquo;Every meaningful connection can inspire learning, kindness, "
        "and positive change.&rdquo;",
        473,
        centered,
    )
    draw_paragraph(c, "With warm wishes,<br/>Sithar", 501, body)

    c.setStrokeColor(HexColor("#F6DFE2"))
    c.setLineWidth(0.5)
    c.line(44, 61, 551, 61)
    c.setFillColor(TEAL)
    c.setFont("DejaVu", 7.4)
    c.drawString(45, 38, "SMILEWITHSITHAR  •  SERVE. EXPLORE. CONNECT. REFRESH.")
    c.drawRightString(550, 38, "7")

    c.save()
    stream.seek(0)
    return PdfReader(stream)


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    source = PdfReader(SOURCE)
    replacement = build_replacement_page()

    writer = PdfWriter()
    for page in source.pages[:6]:
        writer.add_page(page)
    writer.add_page(replacement.pages[0])
    if source.metadata:
        writer.add_metadata(dict(source.metadata))
    with OUTPUT.open("wb") as target:
        writer.write(target)

    print(OUTPUT.resolve())


if __name__ == "__main__":
    main()
