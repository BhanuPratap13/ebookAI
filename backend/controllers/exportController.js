const Book = require("../models/Book");
const { generateDocx } = require("../utils/docx.generator.js");
const { generatePdf } = require("../utils/pdf.generator.js");

async function exportAsDocx(req, res) {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "No such book exists!" });
    }

    if (book.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        error:
          "You are not authorized to perform any operations on the requested book!",
      });
    }

    const docBuffer = await generateDocx(book);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx"`
    );
    res.setHeader("Content-Length", docBuffer.length);
    res.setHeader("Content-Transfer-Encoding", "binary");
    res.setHeader("Cache-Control", "no-cache");

    res.send(docBuffer);
  } catch (error) {
    console.error("Error exporting as DOCX:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
}

async function exportAsPdf(req, res) {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "No such book exists!" });
    }

    if (book.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        error:
          "You are not authorized to perform any operations on the requested book!",
      });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`
    );
    res.setHeader("Content-Transfer-Encoding", "binary");
    res.setHeader("Cache-Control", "no-cache");

    await generatePdf(book, res);
  } catch (error) {
    console.error("Error exporting as PDF:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = { exportAsDocx, exportAsPdf };