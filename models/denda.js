"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Denda extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Denda.belongsTo(models.Mahasiswa, {
        foreignKey: "id_mahasiswa",
        as: "mahasiswa",
      });
      Denda.belongsTo(models.Buku, {
        foreignKey: "id_buku",
        as: "buku",
      });
    }
  }
  Denda.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      tanggal_pengembalian: {
        type: DataTypes.DATEONLY,
      },
      id_buku: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      id_mahasiswa: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      tanggal_jatuh_tempo: {
        type: DataTypes.DATEONLY,
      },
      tanggal_peminjaman: {
        type: DataTypes.DATEONLY,
      },
      status: {
        type: DataTypes.ENUM(
          "hilang",
          "rusak",
          "terlambat",
          "hilang dan terlambat",
          "rusak dan terlambat"
        ),
      },
      nominal: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Denda",
      tableName: "denda",
      freezeTableName: true,
      underscored: true,
      paranoid: true,
    }
  );
  return Denda;
};
