const router = require("express").Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  exportAsDocx,
  exportAsPdf,
} = require("../controllers/exportController");

// All export routes require authentication
router.use(protect);

router.get("/:id/pdf", exportAsPdf);
router.get("/:id/doc", exportAsDocx);

module.exports = router;