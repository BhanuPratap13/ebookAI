const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
} = require("docx");

/**
 * Parse markdown text into docx Paragraph elements
 */
function parseMarkdownToParagraphs(markdownText) {
  if (!markdownText) return [new Paragraph({ text: "" })];

  const lines = markdownText.split("\n");
  const paragraphs = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // H1
    if (line.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          text: line.slice(2).trim(),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 150 },
        })
      );
    }
    // H2
    else if (line.startsWith("## ")) {
      paragraphs.push(
        new Paragraph({
          text: line.slice(3).trim(),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
        })
      );
    }
    // H3
    else if (line.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          text: line.slice(4).trim(),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 200, after: 100 },
        })
      );
    }
    // Bullet list items
    else if (line.match(/^[\-\*] /)) {
      const content = line.slice(2).trim();
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: "• " + content })],
          indent: { left: 720 },
          spacing: { before: 60, after: 60 },
        })
      );
    }
    // Numbered list items
    else if (line.match(/^\d+\. /)) {
      const content = line.replace(/^\d+\. /, "").trim();
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: content })],
          numbering: { reference: "default-numbering", level: 0 },
          spacing: { before: 60, after: 60 },
        })
      );
    }
    // Code block (start)
    else if (line.startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      if (codeLines.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeLines.join("\n"),
                font: "Courier New",
                size: 18,
              }),
            ],
            spacing: { before: 120, after: 120 },
            indent: { left: 720 },
          })
        );
      }
    }
    // Empty line
    else if (line.trim() === "") {
      paragraphs.push(new Paragraph({ text: "", spacing: { after: 120 } }));
    }
    // Regular paragraph with inline formatting
    else {
      const runs = parseInlineMarkdown(line.trim());
      if (runs.length > 0) {
        paragraphs.push(
          new Paragraph({
            children: runs,
            spacing: { before: 60, after: 120 },
          })
        );
      }
    }
  }

  return paragraphs.length > 0 ? paragraphs : [new Paragraph({ text: "" })];
}

/**
 * Parse inline markdown (bold, italic, code) into TextRun array
 */
function parseInlineMarkdown(text) {
  const runs = [];
  // Handle **bold**, *italic*, `code`
  const regex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|([^*`]+))/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[2]) {
      // Bold
      runs.push(new TextRun({ text: match[2], bold: true }));
    } else if (match[3]) {
      // Italic
      runs.push(new TextRun({ text: match[3], italics: true }));
    } else if (match[4]) {
      // Code
      runs.push(
        new TextRun({ text: match[4], font: "Courier New", size: 18 })
      );
    } else if (match[5]) {
      // Normal text
      runs.push(new TextRun({ text: match[5] }));
    }
  }

  return runs.length > 0 ? runs : [new TextRun({ text })];
}

async function generateDocx(book) {
  const children = [];

  // Title Page
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: book.title,
          bold: true,
          size: 56,
          color: "1a1a2e",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 1440, after: 400 },
    })
  );

  if (book.subtitle) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: book.subtitle,
            italics: true,
            size: 32,
            color: "555555",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 600 },
      })
    );
  }

  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `By ${book.author}`,
          size: 28,
          color: "333333",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 1440 },
    })
  );

  // Page Break after title
  children.push(
    new Paragraph({
      children: [new PageBreak()],
    })
  );

  // Table of Contents
  if (book.chapters && book.chapters.length > 0) {
    children.push(
      new Paragraph({
        text: "Table of Contents",
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 },
      })
    );

    book.chapters.forEach((chapter, index) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `Chapter ${index + 1}: `, bold: true }),
            new TextRun({ text: chapter.title }),
          ],
          spacing: { before: 100, after: 100 },
          indent: { left: 360 },
        })
      );
    });

    children.push(
      new Paragraph({
        children: [new PageBreak()],
      })
    );
  }

  // Chapters
  if (book.chapters && book.chapters.length > 0) {
    book.chapters.forEach((chapter, index) => {
      // Chapter heading
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Chapter ${index + 1}`,
              bold: true,
              size: 24,
              color: "888888",
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { before: 400, after: 100 },
        })
      );

      children.push(
        new Paragraph({
          text: chapter.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 100, after: 300 },
        })
      );

      // Chapter description if available
      if (chapter.description) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: chapter.description,
                italics: true,
                color: "666666",
              }),
            ],
            spacing: { before: 100, after: 200 },
          })
        );
      }

      // Chapter content
      if (chapter.content && chapter.content.trim()) {
        const contentParagraphs = parseMarkdownToParagraphs(chapter.content);
        contentParagraphs.forEach((p) => children.push(p));
      } else {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "[No content written for this chapter]",
                italics: true,
                color: "aaaaaa",
              }),
            ],
          })
        );
      }

      // Page break between chapters (not after last)
      if (index < book.chapters.length - 1) {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
      }
    });
  }

  const doc = new Document({
    creator: book.author,
    title: book.title,
    description: book.subtitle || "",
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
}

module.exports = { generateDocx };
