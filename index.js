const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const corsOptions = require("./src/config/corsOptions");
dotenv.config();
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cookieParser());

// handle CORS
app.use(cors(corsOptions));

// supaya kita bisa baca body dari request kita
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const kategoriRouter = require("./src/routes/kategori");
const movieRouter = require("./src/routes/movie");
const authRouter = require("./src/routes/auth");
app.use("/api/v1/kategori", kategoriRouter);
app.use("/api/v1/movie", movieRouter);
app.use("/api/v1/auth", authRouter);

const initApp = async () => {
  console.log("Connecting to mongo");
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/kuliah_iso_movie");
    console.log("Berhasil Connect");
    app.listen(port, () =>
      console.log(`Example app listening on port ${port}!`)
    );
  } catch (error) {
    console.error(error);
  }
};

initApp();
