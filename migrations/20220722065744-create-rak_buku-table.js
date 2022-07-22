"use strict";
const field = require("../constant/field");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "rak_buku",
      field(Sequelize, {
        nama: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("rak_buku");
  },
};
