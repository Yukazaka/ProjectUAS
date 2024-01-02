// extension mongo snippets for node punya rohan mukherjee

const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var KategoriMovieSchema = new mongoose.Schema({
  _id: Number,
  nama: String,
});

// Misalnya menambah kolom secara virtual (tidak tercantum dalam database)
KategoriMovieSchema.virtual("ide").get(function () {
  return "tes";
});

// setting bahwa nanti kalau ambil datanya dalam bentuk json, jangan lupa virtuals kolom dikembalikan
// by default ternyata virtual "id", itu otomatis dibuatkan dan bawaan dari virtuals : true
KategoriMovieSchema.set("toJSON", {
  virtuals: true,
});

//Export the model
/**
 * Parameter ke 1 : bentuk singular dari model kita
 * Parameter ke 2 : schema yang menjelaskan collection kita bentuknya seperti apa
 * Paramter ke 3 : nama collection di mongodb kalian
 */
const KategoriMovie = mongoose.model(
  "kategori_movie",
  KategoriMovieSchema,
  "kategori_movie"
);

module.exports = KategoriMovie;
