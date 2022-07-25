"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pengembalian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pengembalian.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      tanggal_pengembalian: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_peminjaman: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      denda: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Pengembalian",
      tableName: "pengembalian",
      freezeTableName: true,
      underscored: true,
      paranoid: true,
    }
  );
  return Pengembalian;
};
