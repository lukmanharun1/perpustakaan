"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Peminjaman extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Peminjaman.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      tanggal_peminjaman: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      tanggal_pengembalian: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_buku: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      id_mahasiswa: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Peminjaman",
      tableName: "peminjaman",
      freezeTableName: true,
      underscored: true,
      paranoid: true,
    }
  );
  return Peminjaman;
};
