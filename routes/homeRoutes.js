const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

//Get request for "/" route
router.get("/", homeController.getHome);

//Get reqest for "/contact" route
router.get("/contact", homeController.getContactPage);

module.exports = router;