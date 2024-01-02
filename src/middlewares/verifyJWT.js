const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Header tidak ada" });
  }
  // kenapa di split? karena bentuknya Bearer <lalu token kalian disini, makanya pakai index ke 1>
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(err.message);
      return res.status(401).json({ msg: "Invalid Token" });
    }
    // Ini penting, agar kita bisa kasi tau middleware checkRoles data penggunanya, TERMASUK ROLE NYA
    req.pengguna = decoded.pengguna;
    next();
  });
};

module.exports = verifyJWT;
