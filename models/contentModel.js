module.exports = (sequelize, DataTypes) => {
  const listContent = sequelize.define("List_Content", {
    content_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  });

  return listContent;
};
