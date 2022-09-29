const {
  DataTypes
} = require('sequelize');

module.exports = sequelize => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: true,
      autoIncrement: false,
      comment: null,
      field: "id"
    },
    Name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Name"
    },
    Age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Age"
    },
    Address: {
      type: DataTypes.CHAR(25),
      allowNull: true,
      defaultValue: "(NULL)",
      primaryKey: false,
      autoIncrement: false,
      comment: null,
      field: "Address"
    }
  };
  const options = {
    tableName: "patient",
    comment: "",
    indexes: []
  };
  const PatientModel = sequelize.define("patient_model", attributes, options);
  return PatientModel;
};