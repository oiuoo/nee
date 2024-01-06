const db = require("../config/config.js");
const Admin = db.admin;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const listProject = db.listProject;
const listContent = db.listContent;
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://scuede.appspot.com",
});
const register = async (req, res) => {
  const { username, password, userFullName, userIMG } = req.body;
  try {
    const bucket = admin.storage().bucket();
    const folderNamae = "admin";
    const avatarFileName = `${folderNamae}/${userIMG}`;
    const file = bucket.file(avatarFileName);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on("error", (err) => {
      console.error("Error uploading to Firebase Storage:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
    stream.on("finish", async () => {
      const avatarUrl = `https://storage.googleapis.com/${process.env.storageBucket}/${avatarFileName}`;
      // Validasi input
      if (!username || !password || !userFullName) {
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
        password,
        userFullName,
        userIMG,
        isAdmin: true,
      });
      res.status(201).json({
        message: "Admin berhasil didaftarkan",
        data: admin,
      });
    });
    stream.end(req.file.buffer);
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
    // const isValid = await bcrypt.compare(password, admin.password);
    // if (!isValid) {
    //   return res.status(401).json({
    //     message: "username/password salah 2",
    //   });
    // }

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
  res.clearCookie("access_token");
  res.status(200).json({
    message: "Logout successfully",
  });
};

//tambah projek
const addProject = async (req, res) => {
  try {
    const { project_name, description, type_content } = req.body;

    const existProject = await listProject.findOne({
      where: {
        project_name,
      },
    });
    if (existProject) {
      return res.status(400).json({ message: "Project sudah ada" });
    }
    const newProject = await listProject.create({
      project_name,
      description,
      type_content,
    });
    return res
      .status(201)
      .json({ message: "Project berhasil dibuat", project: newProject });
  } catch (error) {
    return res.status(500).json({ error: "Gagal membuat Project" });
  }
};
const addContent = async (req, res) => {
  const allowedContentTypes = ["image/jpeg", "image/png", "video/mp4"];
  const { filename, project_id } = req.body;
  try {
    if (!allowedContentTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: "Tipe file tidak valid.",
      });
    }

    const bucket = admin.storage().bucket();
    const folderName = "content";
    const avatarFileName = `${folderName}/${filename}`;
    const file = bucket.file(avatarFileName);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });
    stream.on("error", (err) => {
      console.error("Error uploading to Firebase Storage:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
    stream.on("finish", async () => {
      const avatarUrl = `https://storage.googleapis.com/${process.env.storageBucket}/${avatarFileName}`;
      const project = await listProject.findByPk(project_id);
      if (!project) {
        return res.status(400).json({ error: "Project not found" });
      }
      const content = await listContent.create({
        filename,
        project_id,
      });
      res.status(201).json({
        message: "content berhasil di upload",
        data: content,
      });
    });
    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan saat mengaupload",
      data: null,
    });
  }
};
//update projek
const updateProject = async (req, res) => {
  try {
    // const updatedProject = await listProject.findByPk(project_id);
    const [updatedRows] = await listProject.update(
      {
        project_name: req.body.project_name,
        description: req.body.description,
        type_content: req.body.type_content,
      },
      { returning: true, where: { project_id: req.params.id } }
    );

    if (updatedRows) {
      res.status(200).json({
        message: "Proyek berhasil diupdate",
        data: updatedRows,
      });
    } else {
      res.status(404).json({
        error: "Proyek tidak ditemukan",
      });
    }
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//delete projek
const deleteProject = async (req, res) => {
  const project_id = req.params.id;
  try {
    await listProject.destroy({
      where: { project_id: project_id },
      include: [{ model: listContent, where: { project_id: project_id } }],
    }),
      res.status(200).json("Project di hapus");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//get all projek
const getAllProject = async (req, res) => {
  const Project = await listProject.findAll({
    include: [{ model: listContent }],
  });
  res.status(200).json(Project);
};

//get one projek
const getOneProject = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await listProject.findByPk({
      where: { project_id: id },
      // include: [{ model: listContent, where: { project_id: project_id } }],
    });

    if (project) {
      res.status(200).json(project);
    } else {
      res.status(404).json({ error: "Proyek tidak ditemukan" });
    }
  } catch (error) {
    console.error("Error retrieving project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getContent = async (req, res) => {
  const filename = req.body;
  try {
    const folderName = "content";
    const file = admin.storage().bucket().file(`${folderName}/${filename}`);
    const url = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2100",
    });
    res.status(201).json({
      message: "content berhasil didapatkan",
      data: url[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const stream = async (req, res) => {
  const filename = req.body;
  try {
    const folderName = "content";
    const file = admin.storage().bucket().file(`${folderName}/${filename}`);
    const url = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2100",
    });

    // Gunakan modul 'request' untuk melakukan streaming file dari URL Firebase Storage ke klien
    const request = require("request");
    request(url[0]).pipe(res);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  addProject,
  updateProject,
  deleteProject,
  getAllProject,
  getOneProject,
  getContent,
  addContent,
  stream,
  register,
  login,
  logOut,
};
