const { KategoriMovie } = require("../models");

const queryKategori = async (req, res) => {
  const result = await KategoriMovie.find().exec();
  if (result.length < 1) {
    return res.status(404).json({ message: "Kategori tidak ditemukan" });
  } else {
    return res.status(200).json(result);
  }
};

module.exports = {
  queryKategori,
};
