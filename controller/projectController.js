const db = require("../config/config");
const listProject = db.listProject;
const listContent = db.listContent;
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://scuede.appspot.com",
});

const addImage = async (req, res) => {
  try {
    const bucket = admin.storage().bucket();
    const imageBuffer = req.file.buffer;
    const imageName = req.file.originalname;
    const file = bucket.file(imageName);
    const result = await file.save(imageBuffer, {
      contentType: "image/jpeg/mp4",
    });
    return res.status(200).json({ message: "upload berhasil" });
  } catch (error) {
    res.status(500).send(`Error uploading image ${error} `);
  }
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

//update projek
const updateProject = async (req, res) => {
  const id = req.params.id;

  const product = await listProject.update(req.body, {
    where: { project_id: id },
  });

  res.status(200).send(product);
};

//delete projek
const deleteProject = async (req, res) => {
  const id = req.params.id;

  await listProject.destroy({ where: { project_id: id } });

  res.status(200).send("Project di hapus");
};

//get all projek
const getAllProject = async (req, res) => {
  const Project = await listProject.findAll({
    include: [{ model: listContent }],
  });
  res.status(200).send(Project);
};

//get one projek
const getOneProject = async (req, res) => {
  const id = req.params.id;
  const project = await listProject.findOne({
    include: [{ model: listContent }],
    where: { id: id },
  });
  res.status(200).send(project);
};

module.exports = {
  addProject,
  updateProject,
  deleteProject,
  getAllProject,
  getOneProject,
  addImage,
};
