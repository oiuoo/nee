module.exports = (sequelize, DataTypes) => {
  const admin = sequelize.define("Admin", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      primaryKey: true,
      autoIncrement: true,

    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    userFullName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    userIMG: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    isAdmin:{
      type : DataTypes.BOOLEAN,
      allowNull : true,
      defaultValue : false
    }
  });
  return admin;
};
