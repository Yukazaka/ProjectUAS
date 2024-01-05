const { mongoose, Schema } = require("mongoose");

const AssassinSchema = new Schema({
  // diingat2 bahwa _id adalah mongoose.Types.ObjectId
  //   _id: mongoose.Types.ObjectId,
  nama: String,
  jk: String,
  password: String,
  refresh_token: String,
  roles: [String],
});

/**
 * Parameter ketiga model adalah nama collection di mongodb mu
 * Karena kalau tidak nanti dia mengasumsikan collection di mongodb mu adalah penggunas
 */
const Assassin = mongoose.model("assassin", AssassinSchema, "assassin");

module.exports = Assassin;
