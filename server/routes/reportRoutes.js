const express = require("express");
const router = express.Router();

const {
  createReport,
  getReports,
  resolveReport,
} = require("../controllers/reportController");

router.post("/report", createReport);
router.get("/reports", getReports);
router.put("/report/resolve", resolveReport);

module.exports = router;