const PDFDocument = require("pdfkit");

/**
 * Strip markdown syntax from text for plain PDF rendering
 */
function stripMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/#{1,6}\s+/g, "") // remove heading markers
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/```[\s\S]*?```/g, (match) =>
      match.replace(/```\w*\n?/g, "").replace(/```/g, "")
    ) // code blocks
    .replace(/^\s*[-*]\s+/gm, "• ") // bullet points
    .replace(/^\s*\d+\.\s+/gm, "") // numbered lists
    .trim();
}

/**
 * Detect the type of a markdown line
 */
function getLineType(line) {
  if (line.startsWith("# ")) return { type: "h1", text: line.slice(2).trim() };
  if (line.startsWith("## "))
    return { type: "h2", text: line.slice(3).trim() };
  if (line.startsWith("### "))
    return { type: "h3", text: line.slice(4).trim() };
  if (line.match(/^[\-\*] /))
    return { type: "bullet", text: "• " + line.slice(2).trim() };
  if (line.match(/^\d+\. /))
    return { type: "numbered", text: line.replace(/^\d+\. /, "").trim() };
  if (line.startsWith("```")) return { type: "codeblock", text: "" };
  if (line.trim() === "") return { type: "empty", text: "" };
  return { type: "paragraph", text: line.trim() };
}

/**
 * Render markdown content on the PDF document
 */
function renderMarkdown(doc, markdownText, options = {}) {
  const lines = markdownText.split("\n");
  let inCodeBlock = false;
  let codeLines = [];
  const leftMargin = options.leftMargin || 72;
  const pageWidth = doc.page.width - leftMargin * 2;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // End code block - render collected lines
        inCodeBlock = false;
        if (codeLines.length > 0) {
          doc.addPage();
          doc
            .font("Courier")
            .fontSize(10)
            .fillColor("#333333")
            .text(codeLines.join("\n"), leftMargin + 20, doc.y, {
              width: pageWidth - 40,
            });
          doc.moveDown(0.5);
          codeLines = [];
        }
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    const parsed = getLineType(line);

    switch (parsed.type) {
      case "h1":
        doc.moveDown(0.5);
        doc
          .font("Helvetica-Bold")
          .fontSize(20)
          .fillColor("#1a1a2e")
          .text(parsed.text, leftMargin, doc.y, { width: pageWidth });
        doc.moveDown(0.4);
        break;

      case "h2":
        doc.moveDown(0.4);
        doc
          .font("Helvetica-Bold")
          .fontSize(16)
          .fillColor("#2d2d44")
          .text(parsed.text, leftMargin, doc.y, { width: pageWidth });
        doc.moveDown(0.3);
        break;

      case "h3":
        doc.moveDown(0.3);
        doc
          .font("Helvetica-Bold")
          .fontSize(13)
          .fillColor("#444455")
          .text(parsed.text, leftMargin, doc.y, { width: pageWidth });
        doc.moveDown(0.25);
        break;

      case "bullet":
      case "numbered":
        doc
          .font("Helvetica")
          .fontSize(11)
          .fillColor("#333333")
          .text(parsed.text, leftMargin + 20, doc.y, {
            width: pageWidth - 20,
          });
        doc.moveDown(0.15);
        break;

      case "paragraph":
        // Handle inline bold/italic by stripping for now
        const cleanText = parsed.text
          .replace(/\*\*([^*]+)\*\*/g, "$1")
          .replace(/\*([^*]+)\*/g, "$1")
          .replace(/`([^`]+)`/g, "$1");
        doc
          .font("Helvetica")
          .fontSize(11)
          .fillColor("#333333")
          .text(cleanText, leftMargin, doc.y, {
            width: pageWidth,
            align: "justify",
          });
        doc.moveDown(0.4);
        break;

      case "empty":
        doc.moveDown(0.3);
        break;

      default:
        break;
    }
  }
}

async function generatePdf(book, res) {
  const doc = new PDFDocument({
    autoFirstPage: true,
    size: "A4",
    margins: { top: 72, bottom: 72, left: 72, right: 72 },
    info: {
      Title: book.title,
      Author: book.author,
      Subject: book.subtitle || "",
    },
  });

  // Pipe to response
  doc.pipe(res);

  // ─── TITLE PAGE ───────────────────────────────────────────────
  const pageW = doc.page.width;
  const pageH = doc.page.height;

  // Background header bar
  doc.rect(0, 0, pageW, pageH * 0.45).fill("#1a1a2e");

  // Title
  doc
    .font("Helvetica-Bold")
    .fontSize(36)
    .fillColor("#ffffff")
    .text(book.title, 72, pageH * 0.12, {
      width: pageW - 144,
      align: "center",
    });

  // Subtitle
  if (book.subtitle) {
    doc
      .font("Helvetica")
      .fontSize(18)
      .fillColor("#aaaadd")
      .text(book.subtitle, 72, doc.y + 20, {
        width: pageW - 144,
        align: "center",
      });
  }

  // Author
  doc
    .font("Helvetica")
    .fontSize(16)
    .fillColor("#cccccc")
    .text(`By ${book.author}`, 72, pageH * 0.35, {
      width: pageW - 144,
      align: "center",
    });

  // ─── TABLE OF CONTENTS ────────────────────────────────────────
  if (book.chapters && book.chapters.length > 0) {
    doc.addPage();

    doc
      .font("Helvetica-Bold")
      .fontSize(24)
      .fillColor("#1a1a2e")
      .text("Table of Contents", 72, 72, { width: pageW - 144 });

    doc
      .moveTo(72, doc.y + 10)
      .lineTo(pageW - 72, doc.y + 10)
      .strokeColor("#e0e0e0")
      .lineWidth(1)
      .stroke();

    doc.moveDown(1.5);

    book.chapters.forEach((chapter, index) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .fillColor("#555555")
        .text(`Chapter ${index + 1}`, 72, doc.y, { continued: true })
        .font("Helvetica")
        .fillColor("#333333")
        .text(`: ${chapter.title}`, {
          width: pageW - 144 - 80,
          align: "left",
        });
      doc.moveDown(0.4);
    });
  }

  // ─── CHAPTERS ─────────────────────────────────────────────────
  if (book.chapters && book.chapters.length > 0) {
    book.chapters.forEach((chapter, index) => {
      doc.addPage();

      // Chapter number label
      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor("#999999")
        .text(`Chapter ${index + 1}`, 72, 72);

      doc.moveDown(0.3);

      // Chapter Title
      doc
        .font("Helvetica-Bold")
        .fontSize(24)
        .fillColor("#1a1a2e")
        .text(chapter.title, 72, doc.y, { width: pageW - 144 });

      // Divider line
      doc
        .moveTo(72, doc.y + 12)
        .lineTo(pageW - 72, doc.y + 12)
        .strokeColor("#e8e8f0")
        .lineWidth(1.5)
        .stroke();

      doc.moveDown(1.5);

      // Chapter description
      if (chapter.description) {
        doc
          .font("Helvetica-Oblique")
          .fontSize(12)
          .fillColor("#666666")
          .text(chapter.description, 72, doc.y, {
            width: pageW - 144,
            align: "left",
          });
        doc.moveDown(1);
      }

      // Chapter content
      if (chapter.content && chapter.content.trim()) {
        renderMarkdown(doc, chapter.content, { leftMargin: 72 });
      } else {
        doc
          .font("Helvetica-Oblique")
          .fontSize(11)
          .fillColor("#aaaaaa")
          .text("[No content written for this chapter yet.]", 72, doc.y);
      }
    });
  }

  // ─── End of Book Page ─────────────────────────────────────────
  doc.addPage();
  doc.rect(0, 0, pageW, pageH).fill("#1a1a2e");
  doc
    .font("Helvetica-Bold")
    .fontSize(28)
    .fillColor("#ffffff")
    .text("Thank You for Reading", 72, pageH / 2 - 40, {
      width: pageW - 144,
      align: "center",
    });
  doc
    .font("Helvetica")
    .fontSize(16)
    .fillColor("#aaaadd")
    .text(`— ${book.author}`, 72, doc.y + 20, {
      width: pageW - 144,
      align: "center",
    });

  doc.end();
}

module.exports = { generatePdf };
