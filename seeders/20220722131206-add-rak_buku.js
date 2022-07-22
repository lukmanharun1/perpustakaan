"use strict";

const dataRakBuku = require("../constant/rak_buku-seeder");
const { RakBuku } = require("../models");
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all(
      dataRakBuku.map(async (data) => {
        try {
          await RakBuku.findOrCreate({
            where: data,
            defaults: data,
          });
        } catch (error) {
          console.log(error);
        }
      })
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("rak_buku", null, {});
  },
};
