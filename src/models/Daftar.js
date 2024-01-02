const { mongoose, Schema } = require("mongoose");

const daftarSchema = new Schema({
  _id: Number,
  nama_target: String,
  tanggal_lahir: Number,
  deskripsi: String,
  kategori: String,
  gender: String,
  // release: [{ _id: mongoose.Types.ObjectId, tipe: String, airing: Number }],
  release: [{ _id: Number, tipe: String, airing: Number }],
});

daftarSchema.virtual("id").get(function () {
  return this._id.toString();
});

daftarSchema.set("toJSON", {
  virtuals: true,
});

/**
 * Parameter ketiga model adalah nama collection di mongodb mu
 */
const daftar = mongoose.model("daftar", daftarSchema, "daftar");

module.exports = Daftar;
