"use strict";
const field = require("../constant/field");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "denda",
      field(Sequelize, {
        tanggal_pengembalian: {
          type: Sequelize.DATEONLY,
        },
        id_buku: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        id_mahasiswa: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        tanggal_jatuh_tempo: {
          type: Sequelize.DATEONLY,
        },
        tanggal_peminjaman: {
          type: Sequelize.DATEONLY,
        },
        status: {
          type: Sequelize.ENUM(
            "hilang",
            "rusak",
            "terlambat",
            "hilang dan terlambat",
            "rusak dan terlambat"
          ),
        },
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("denda");
  },
};
