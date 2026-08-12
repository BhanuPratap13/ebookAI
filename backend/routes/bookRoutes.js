const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  getBookById,
  updateBookContent,  
  deleteBook,
  updateBookCover,
} = require("../controllers/bookController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

// Apply protect middleware to all routes in this file
router.use(protect);

router.route("/")
  .post(createBook)
  .get(getBooks);

router.route("/:bookId")
  .get(getBookById)
  .put(updateBookContent)
  .delete(deleteBook);

router.route("/cover/:bookId")
  .put(upload, updateBookCover);

module.exports = router;