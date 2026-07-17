const Report = require("../models/Report");

const createReport = async (req, res) => {
  try {
    const report = await Report.create(req.body);

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reporter", "name email")
      .populate("reportedUser", "name email")
      .populate("reportedTool", "name");

    res.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.body;

    const report = await Report.findByIdAndUpdate(
      reportId,
      { status: "Resolved" },
      { new: true }
    );

    res.json({
      success: true,
      message: "Report resolved successfully",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReport,
  getReports,
  resolveReport,
};