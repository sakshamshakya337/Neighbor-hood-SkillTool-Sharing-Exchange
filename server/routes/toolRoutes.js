const express = require("express");
const router = express.Router();
const {
  createTool,
  getTools,
  getToolById,
  updateTool,
  deleteTool,
  getCategories,
  searchTools,
} = require("../controllers/toolController");
const { protect } = require("../middleware/authMiddleware");

// Note: In server/app.js, this router will be mounted to a base path.
// If it's mounted to /api/tools, these routes will be relative to that.
// The task says POST /tool, GET /tool etc. So I will mount this router
// in app.js as app.use("/api", toolRoutes) or app.use("/api/tool", toolRoutes).
// Let's assume this router handles both /tool and /categories and /search if mounted at /api.

router.post("/tool", protect, createTool);
router.get("/tool", getTools); // Public
router.get("/tool/:id", getToolById); // Public
router.put("/tool/:id", protect, updateTool);
router.delete("/tool/:id", protect, deleteTool);

router.get("/categories", getCategories); // Public
router.get("/search", searchTools); // Public

module.exports = router;
