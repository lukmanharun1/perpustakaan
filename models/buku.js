"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Buku extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Buku.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      judul_buku: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      nama_penulis: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      nama_penerbit: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      tahun_penerbit: {
        type: Sequelize.STRING(4),
        allowNull: false,
      },
      stok: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_rak_buku: {
        type: Sequelize.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "Buku",
      tableName: "buku",
      freezeTableName: true,
      underscored: true,
      paranoid: true,
    }
  );
  return Buku;
};
