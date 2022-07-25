"use strict";
const field = require("../constant/field");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "peminjaman",
      field(Sequelize, {
        tanggal_peminjaman: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        tanggal_pengembalian: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        id_buku: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        id_mahasiswa: {
          type: Sequelize.UUID,
          allowNull: false,
        },
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("peminjaman");
  },
};
