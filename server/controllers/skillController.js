const Skill = require("../models/Skill");

// POST /api/skill
exports.createSkill = async (req, res) => {
  try {
    const skill = new Skill({
      ...req.body,
      provider: req.user._id,
    });
    const savedSkill = await skill.save();
    res.status(201).json(savedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/skill
exports.getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ isAvailable: true }).populate("category", "name");
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/skill/:id
exports.getSkillById = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id)
      .populate("category", "name")
      .populate("provider", "name email");
    if (!skill) return res.status(404).json({ message: "Skill not found" });
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/skill/:id
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (skill.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this skill" });
    }

    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedSkill);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/skill/:id
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    if (skill.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this skill" });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
