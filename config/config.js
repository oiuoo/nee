require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.admin = require("../models/adminModel")(sequelize, DataTypes);
db.listProject = require("../models/projectModel")(sequelize, DataTypes);
db.listContent = require("../models/contentModel")(sequelize, DataTypes);

db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

db.listProject.hasMany(db.listContent, { foreignKey: "project_id" });
db.listContent.belongsTo(db.listProject, { foreignKey: "project_id" });

module.exports = db;
