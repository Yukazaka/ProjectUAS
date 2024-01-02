/**
 * npm i bcrypt jsonwebtoken cookie-parser
 */

const bcrypt = require("bcrypt");
const { Pengguna } = require("../models");
const jwt = require("jsonwebtoken");
const schema = require("../utils/validations/auth");

const register = async (req, res) => {
  const body = req.body;

  try {
    await schema.register.validateAsync(body, { abortEarly: false });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Pastikan inputan anda sudah benar dan tervalidasi" });
  }

  const penggunaSudahAda = await Pengguna.findOne({ nama: body.nama }).exec();
  if (penggunaSudahAda) {
    return res.status(400).json({
      msg: "Username telah digunakan, silakan mencoba register dengan nama user lain",
    });
  }

  let hashedPassword = "";
  await bcrypt.hash(body.password, 10).then((hash) => {
    hashedPassword = hash;
  });

  const result = await Pengguna.create({
    nama: body.nama,
    jk: body.jk,
    password: hashedPassword,
    refresh_token: "",
    roles: ["visitor"],
  });

  return res.status(200).json(result);
};

const login = async (req, res) => {
  const { nama, password } = req.body;

  if (!nama || !password) {
    return res
      .status(400)
      .json({ msg: "Silakan masukkan username dan password" });
  }

  const pengguna = await Pengguna.findOne({ nama: nama })
    .select("-refresh_token")
    .exec();

  if (!pengguna) {
    return res.status(401).json({ msg: "Gagal login" });
  }

  const checkPassword = await bcrypt.compare(password, pengguna.password);

  if (checkPassword) {
    // hapus dulu password nya !PENTING!
    pengguna.password = undefined;
    //lakukan json.stringify untuk mengubah object menjadi json string
    const accessToken = jwt.sign(
      { pengguna },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_TTL }
    );
    const refreshToken = jwt.sign(
      { pengguna },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_TTL }
    );

    // simpan refresh token ke user
    const updatedPengguna = await Pengguna.findOneAndUpdate(
      { _id: pengguna._id },
      {
        refresh_token: refreshToken,
      },
      {
        new: true,
      }
    );

    // access token kita berikan ke user sehingga user bisa pakai, dan tidak perlu disimpan dalam database
    // simpan access token dalam cookie, TAPI HARUS ADA httpOnly supaya tidak bisa diedit dari browser
    // https://web.dev/schemeful-samesite/

    const maxAgeValue = process.env.REFRESH_TOKEN_COOKIE_TTL * 60000;
    console.log(maxAgeValue);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: maxAgeValue, // nilai di env * 60 Detik (1 menit)
    });
    return res
      .status(200)
      .json({ msg: "Berhasil Login", access_token: accessToken });
  } else {
    return res.status(401).json({ msg: "Gagal login" });
  }
};

const refreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);

  if (!cookies?.jwt) {
    // kalau kita punya cookies, maka cek juga apakah cookies.jwt nya ada tidak
    return res.status(401).send("Tidak bisa baca cookie/tidak ada cookie");
  }
  const refreshToken = cookies.jwt;
  const pengguna = await Pengguna.findOne({ refresh_token: refreshToken })
    .select("-refresh_token")
    .exec();

  if (!pengguna) {
    return res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || pengguna._id.toString() !== decoded.pengguna._id.toString()) {
      return res.sendStatus(403);
    } else {
      // hapus dulu password nya !PENTING!
      pengguna.password = undefined;
      const accessToken = jwt.sign(
        { pengguna },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_TTL }
      );
      return res.status(200).json({ access_token: accessToken });
    }
  });
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); // kebetulan cookienya hbs ya udah, successfull no content
  }
  const refreshToken = cookies.jwt;
  const pengguna = await Pengguna.findOne({
    where: { refresh_token: refreshToken },
  });

  if (!pengguna) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204); // kebetulan cookienya hbs ya udah, successfull no content
  }

  await pengguna.update({ refresh_token: null });
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  return res.sendStatus(204); // kebetulan cookienya hbs ya udah, successfull no content
};

module.exports = { register, login, refreshToken, logout };

/**
 * Authentication & Authorization
 *
 * Authentication : mengecek apakah user tersebut benar dia (dengan login)
 * Authorization : mengecek apakah user tersebut memiliki roles yang cocok dan boleh akses hal tertentu
 *
 * punya 2 konsep yaitu :
 * 1. Access Token = 5-15 min
 * 2. Refresh Token = 1 day bahkan berhari2
 *
 * Masalah
 * 1. XSS
 * 2. CSRF
 *
 * Untuk access token Dari frontend:
 * 1. Kirim sebagai json
 * 2. simpan dalam client memory, supaya kalau apps ditutup, maka hilang (misal simpan dalam state)
 * 3. jangan pernah simpan di local storage / cookie
 *
 * untuk refresh token dari frontend:
 * 1. kirim sebagai httponly cookie
 * 2. tidak bisa diakses dari javascript
 * 3. harus ada expired nya
 *
 * Alurnya Access Token:
 * 1. Dibuat pada saat authorization
 * 2. client pakai api access sampai expired
 * 3. Penggunaan API di verify dengan middleware
 * 4. Ketika access token expired, harus buat new token pada saat refresh request
 *
 * Alurnya refresh token:
 * 1. Dibuat pada saat authorization
 * 2. Client menggunakan refresh token ini untuk request new access token
 * 3. Verify pada endpoint dan database
 * 4. Harus bisa expires juga atau hilang ketika logout
 *
 * ==================================================
 * MISC :
 * - salt rounds
 * //https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt
 *
 * - JWT : json web  (https://jwt.io/)
 *
 * - secret : https://stackoverflow.com/questions/31309759/what-is-secret-key-for-jwt-based-authentication-and-how-to-generate-it
 *
 * - jsonwebtoken expires : https://www.npmjs.com/package/jsonwebtoken
 *
 * - iat adalah : ISSUED AT, sedangkan exp adalah expires kapan
 *
 * - how to store access token dengan aman : https://coolgk.medium.com/localstorage-vs-cookie-for-jwt-access-token-war-in-short-943fb23239ca
 */
