const db = require("../config/config");
const listProject = db.listProject;
const listContent = db.listContent;
// const firebase = require("../config/config.firebase");
// const { getStorage, ref } = require("firebase/storage");

// const storage = firebase.storage().ref();
// global.XMLHttpRequest = require("xhr2");

// const addImage = async (req, res) => {
//   try {
//     const file = req.file;

//     const timestamp = Date.now();
//     const name = file.originalname.split(".")[0];
//     const type = file.originalname.split(".")[1];
//     const fileName = `${name}_${timestamp}.${type}`;

//     const imageRef = storage.child(fileName);

//     const snapshot = await imageRef.put(file.buffer);

//     const downloadURL = await snapshot.ref.getDownloadURL();

//     res.send(downloadURL);
//   } catch (error) {
//     console.log(error);
//     res.status(400).send(error.message);
//   }
// };
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
};
