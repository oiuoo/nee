const db = require("../config/config.js");
const Admin = db.admin;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, password, userFullName, userIMG } = req.body;

    // Validasi input
    if (!username || !password || !userFullName || !userIMG) {
      return res.status(400).json({
        message: "Anda mengirimkan data yang salah",
      });
    }

    //cek nama
    const exists = await Admin.findOne({ where: { username } });
    if (exists) {
      return res.status(400).json({
        message: "username sudah terdaftar",
      });
    }

    // Generate salt dan hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan admin ke database
    const admin = await Admin.create({
      username,
      password: hashedPassword,
      userFullName,
      userIMG,
      isAdmin: true,
    });

    res.status(201).json({
      message: "Admin berhasil didaftarkan",
      data: admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mendaftarkan admin",
      data: null,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Anda mengirimkan data yang salah",
        data: null,
      });
    }
    const admin = await Admin.findOne({ where: { username } });
    if (!admin) {
      return res.status(404).json({
        message: "username/password salah 1",
      });
    }
    // check password
    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({
        message: "username/password salah 2",
      });
    }

    //jwt
    const userToken = {
      user_id: admin.user_id,
      username: admin.username,
    };

    const token = jwt.sign({ userToken }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });
    return res.json({ token: token }).status(200);
  } catch (error) {
    return res.status(500).json({
      message: `Terjadi kesalahan saat login ${error}`,
      data: null,
    });
  }
};
const logOut = async (req, res) => {
  // try {
  //   if (req.headers.authorization) {
  //     // const token = req.headers.authorization.split(" ")[1];
  //     // token = null;
  //     req.headers.authorization = null;
  //     res.json({ msg: "Logout sucessfully" }).status(200);
  //   } else {
  //     res.json({ msg: "Token required" }).status(422);
  //   }
  // } catch (error) {
  //   console.log(error);
  //   res.json({ msg: error }).status(422);
  // }
  // const  auth  = req.cookies.token;
  // // const auth = req.headers.authorization

  // if (!auth) {
  //   return res.status(401).json({
  //     status: "error",
  //     error: "Unauthorized",
  //   });
  // }

  // res.clearCookie("token", null, {
  //   httpOnly: true,
  //   sameSite: "strict",
  //   maxAge: -1,
  // });
  // return res.status(200).json({
  //   message: "Logout successfully",
  // });
  res.clearCookie("access_token");
  res.status(200).json({
    message: "Logout successfully",
  });
};
module.exports = { register, login, logOut };
