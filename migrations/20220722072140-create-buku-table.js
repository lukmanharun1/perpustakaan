"use strict";
const field = require("../constant/field");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "buku",
      field(Sequelize, {
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
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("buku");
  },
};
