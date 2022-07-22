"use strict";
const field = require("../constant/field");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "mahasiswa",
      field(Sequelize, {
        jurusan: {
          type: Sequelize.STRING(128),
          allowNull: false,
        },
        no_telp: {
          type: Sequelize.STRING(13),
          allowNull: false,
        },
        alamat: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        nama_lengkap: {
          type: Sequelize.STRING(128),
          allowNull: false,
        },
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("mahasiswa");
  },
};
