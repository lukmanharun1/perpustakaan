"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Mahasiswa.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      jurusan: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
      no_telp: {
        type: DataTypes.STRING(13),
        allowNull: false,
      },
      alamat: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      nama_lengkap: {
        type: DataTypes.STRING(128),
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Mahasiswa",
      tableName: "mahasiswa",
      freezeTableName: true,
      underscored: true,
      paranoid: true,
    }
  );
  return Mahasiswa;
};
