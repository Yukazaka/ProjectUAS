const { Movie } = require("../models");

const queryMovie = async (req, res) => {
  const { keyword, tahun_terbit_awal, tahun_terbit_akhir } = req.query;
  let result = Daftar.find();

  if (keyword !== undefined) {
    // i dibelakang untuk case-insensitive
    result = result.where("nama", new RegExp(keyword, "i"));
  }

  if (tahun_terbit_awal !== undefined) {
    // // cara mongodb dan mongosh
    // result = result.where({ tahun_terbit: { $gte: tahun_terbit_awal } });

    // cara mongoose
    result = result.where("tahun_terbit").gte(Number(tahun_terbit_awal));
  }

  if (tahun_terbit_akhir !== undefined) {
    result = result.where("tahun_terbit").lte(Number(tahun_terbit_akhir));
  }

  result = await result
    .sort({ _id: 1, kategori_id: -1, tahun_terbit: -1 })
    .populate("kategori")
    .exec();

  if (result.length < 1) {
    return res.status(404).json({ message: "Movie tidak ditemukan" });
  } else {
    return res.status(200).json(result);
  }
};

const getSingleMovie = async (req, res) => {
  // selesaikan masalah kalau misalnya dia mode Insert dan req.params.id nya undefined
  if (req.params.id == "undefined") {
    return res.status(404).json({ message: "Movie tidak ditemukan" });
  }

  const result = await Daftar.findById(Number(req.params.id))
    .populate("kategori")
    .exec();

  if (!result) {
    return res.status(404).json({ message: "Movie tidak ditemukan" });
  } else {
    return res.status(200).json(result);
  }
};

const postMovie = async (req, res) => {
  const getMaxId = await Daftar.aggregate()
    .group({
      _id: null,
      maxId: { $max: "$_id" },
    })
    .project({ _id: 0, maxId: 1 })
    .exec();

  const body = req.body;
  body["_id"] = Number(getMaxId[0].maxId) + 1;

  const result = await Daftar.create(body);

  if (!result) {
    return res.status(500).json({ message: "Gagal Insert" });
  } else {
    return res.status(200).json({ message: "Berhasil Insert", result: result });
  }
};

const putMovie = async (req, res) => {
  const id = Number(req.params.id);
  const body = req.body;

  //   option new untuk mengembalikan data terbaru SETELAH UPDATE
  const result = await Daftar.findOneAndUpdate({ _id: id }, body, { new: true });

  if (!result) {
    return res.status(500).json({ message: "Gagal update" });
  } else {
    return res.status(200).json({ message: "Berhasil update", result: result });
  }
};

const deleteMovie = async (req, res) => {
  const id = Number(req.params.id);

  const result = await Daftar.deleteOne({ _id: id });

  if (result.deletedCount <= 0) {
    return res.status(500).json({ message: "Gagal Delete" });
  } else {
    return res.status(200).json({ message: "Berhasil Delete", result: result });
  }
};

module.exports = {
  queryMovie,
  getSingleMovie,
  postMovie,
  putMovie,
  deleteMovie,
};
