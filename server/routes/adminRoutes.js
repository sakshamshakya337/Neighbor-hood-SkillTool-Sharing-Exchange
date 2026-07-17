const express = require("express");
const {
  getDashboard,
  getUsers,
  blockUser,
  deleteUser,
  getTools,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", getDashboard);
router.get("/users", getUsers);
router.get("/tools", getTools);
router.put("/block-user", blockUser);
router.delete("/delete-user", deleteUser);

module.exports = router;