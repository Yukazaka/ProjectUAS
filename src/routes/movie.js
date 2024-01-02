const express = require("express");
const {
  queryMovie,
  getSingleMovie,
  postMovie,
  putMovie,
  deleteMovie,
} = require("../controllers/movie");
const router = express.Router();

router.get("/", queryMovie);
router.get("/:id", getSingleMovie);
router.post("/", postMovie);
router.put("/:id", putMovie);
router.delete("/:id", deleteMovie);

module.exports = router;
