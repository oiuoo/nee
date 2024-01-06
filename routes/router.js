const router = require("express").Router();
const adminController = require("../controller/adminController.js");
const verifyToken = require("../middleware/verify.js");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//admin
router.post("/register", upload.single("userIMG"), adminController.register);
router.post("/login", adminController.login);
router.post("/logout", adminController.logOut);

//project
router.post("/project/simpanProject", verifyToken, adminController.addProject);
router.post("/project/simpanContent",verifyToken,upload.single("filename"),adminController.addContent);
router.patch("/project/edit/:id", verifyToken, adminController.updateProject);
router.delete("/project/hapus/:id", verifyToken, adminController.deleteProject);
router.get("/project/getContent",verifyToken, adminController.getContent);
router.get("/project/streamFile",verifyToken, adminController.stream);

//pengunjung
router.get("/project", adminController.getAllProject);
router.get("/project/:id", adminController.getOneProject);

module.exports = router;
