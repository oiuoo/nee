require("dotenv").config();
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  // mengambil Bearer token dari header
  //   const authHeader = req.headers.authorization;
  //   if (authHeader) {
  //     const token = authHeader.split(" ")[1];
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: "jwt must be provided",
    });
  }
  // verifikasi token
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token" });
    }
    req.user = decoded;
    //berhasil
    next();
  });
  //   } else {
  //     //gagal
  //     res.status(401).send({
  //       auth: false,
  //       message: "Token required",
  //     });
  //   }
};

module.exports = verifyToken;
