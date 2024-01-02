require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  // cek header
  if (req.headers.authorization) {
    // mengambil Bearer token dari header
    const token = req.headers.authorization.split(" ")[1];

    // verifikasi token
    jwt.verify(token, process.env.JWT_KEY, (err) => {
      if (err) {
        return res.status(500).send({ auth: false, message: err });
      }
      //berhasil
      next();
    });
  } else {
    //gagal
    res.status(401).send({
      auth: false,
      message: "Token required",
    });
  }
};

module.exports = verifyToken;
