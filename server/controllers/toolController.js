const Tool = require("../models/Tool");
const Category = require("../models/Category");

// POST /api/tool
exports.createTool = async (req, res) => {
  try {
    const tool = new Tool({
      ...req.body,
      owner: req.user._id, // Assuming auth middleware sets req.user
    });
    const savedTool = await tool.save();
    res.status(201).json(savedTool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/tool
exports.getTools = async (req, res) => {
  try {
    const tools = await Tool.find({ isAvailable: true }).populate("category", "name");
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/tool/:id
exports.getToolById = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id).populate("category", "name").populate("owner", "name email");
    if (!tool) return res.status(404).json({ message: "Tool not found" });
    res.json(tool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/tool/:id
exports.updateTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: "Tool not found" });

    // Check if the user is the owner or an admin
    if (tool.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this tool" });
    }

    const updatedTool = await Tool.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTool);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/tool/:id
exports.deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: "Tool not found" });

    if (tool.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this tool" });
    }

    await Tool.findByIdAndDelete(req.params.id);
    res.json({ message: "Tool removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/search
exports.searchTools = async (req, res) => {
  try {
    const { q, category } = req.query;
    let query = { isAvailable: true };
    
    if (q) {
      query.$text = { $search: q };
    }
    if (category) {
      query.category = category;
    }
    
    const tools = await Tool.find(query).populate("category", "name");
    res.json(tools);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
