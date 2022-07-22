"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RakBuku extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RakBuku.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      operasi: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      investasi: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      pendanaan: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "RakBuku",
      tableName: "rak_buku",
      freezeTableName: true,
      underscored: true,
      paranoid: true,
    }
  );
  return RakBuku;
};
