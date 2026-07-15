const express = require("express");
const router = express.Router();
const {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} = require("../controllers/skillController");
const { protect } = require("../middleware/authMiddleware");

router.post("/skill", protect, createSkill);
router.get("/skill", getSkills);
router.get("/skill/:id", getSkillById);
router.put("/skill/:id", protect, updateSkill);
router.delete("/skill/:id", protect, deleteSkill);

module.exports = router;
