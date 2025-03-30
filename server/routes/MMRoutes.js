const express = require("express");
const router = express.Router();
const { fetchAndInsertMetData, getMetData } = require("../controllers/MMController");

// Fetch MET forecast and insert into DB (manually triggered)
router.get("/met/fetch", fetchAndInsertMetData);

// Get stored MET forecast from DB (for frontend)
router.get("/met", getMetData);

module.exports = router;
