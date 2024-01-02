const express = require("express");
const { queryKategori } = require("../controllers/kategori");
const router = express.Router();

router.get("/", queryKategori);

module.exports = router;
