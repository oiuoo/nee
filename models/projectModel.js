module.exports = (sequelize, DataTypes) => {
  const listProject = sequelize.define("List_Project", {
    project_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    project_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    type_content: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  });
  return listProject;
};
