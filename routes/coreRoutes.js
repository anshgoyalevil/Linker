const express = require("express");
const router = express.Router();
const coreController = require("../controllers/coreController");

router.get("/stats", coreController.getStatsPage);

module.exports = router;