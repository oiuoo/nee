const router = require("express").Router();
const adminController = require("../controller/adminController.js");
const projectController = require("../controller/projectController.js");
const verifyToken = require("../middleware/verify.js");

router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post("/logout", adminController.logOut);

router.post("/project/simpan",verifyToken, projectController.addProject);
router.put("/project/edit/{id}",verifyToken, projectController.updateProject);
router.delete("/project/hapus/{id}",verifyToken, projectController.deleteProject);

router.get("/project", projectController.getAllProject);
router.get("/project/{id}", projectController.getOneProject);

module.exports = router;
