"use strict";
const field = require("../constant/field");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "pengembalian",
      field(Sequelize, {
        tanggal_pengembalian: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        id_peminjaman: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        denda: {
          type: Sequelize.INTEGER,
        },
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pengembalian");
  },
};
