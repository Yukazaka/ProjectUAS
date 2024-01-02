const { mongoose, Schema } = require("mongoose");

const MovieSchema = new Schema({
  _id: Number,
  nama: String,
  tahun_terbit: Number,
  kategori: { type: Number, ref: "kategori_movie" },
  publisher: String,
  deskripsi: String,
  img: String,
  // release: [{ _id: mongoose.Types.ObjectId, tipe: String, airing: Number }],
  release: [{ _id: Number, tipe: String, airing: Number }],
});

MovieSchema.virtual("id").get(function () {
  return this._id.toString();
});

MovieSchema.set("toJSON", {
  virtuals: true,
});

/**
 * Parameter ketiga model adalah nama collection di mongodb mu
 */
const Movie = mongoose.model("movie", MovieSchema, "movie");

module.exports = Movie;
