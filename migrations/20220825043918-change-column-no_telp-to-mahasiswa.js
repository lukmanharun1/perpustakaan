"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("mahasiswa", "no_telp", {
      type: Sequelize.STRING(13),
      unique: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("mahasiswa", "no_telp", {
      type: Sequelize.STRING(13),
      unique: false,
    });
  },
};
