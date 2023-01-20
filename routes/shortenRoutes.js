const express = require("express");
const router = express.Router();
const shortenController = require("../controllers/shortenController");

router.post("/shorten", shortenController.postShorten);

//Get request for "/shorten" route
router.get("/shorten", shortenController.getShorten);

router.get("/go/:slink", shortenController.getGoCustomAlias);

router.get("/i/:slink", shortenController.getICustomAlias);

module.exports = router;