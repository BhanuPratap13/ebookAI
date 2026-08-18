const express = require("express");
const router = express.Router();

const {
    generateBookOutline,
    generateChapterContent,
    generateCover,
} = require("../controllers/aiController");

const { protect } = require("../middlewares/authMiddleware");

// Apply protect middleware to all routes
router.use(protect);

router.post("/generate-outline", generateBookOutline);
router.post("/generate-chapter-content", generateChapterContent);
router.post("/generate-cover", generateCover);

module.exports = router;