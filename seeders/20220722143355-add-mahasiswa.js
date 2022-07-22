"use strict";

const dataMahasiswa = require("../constant/mahasiswa-seeder");
const { Mahasiswa } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all(
      await dataMahasiswa.map(async (data) => {
        try {
          await Mahasiswa.findOrCreate({
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
    await queryInterface.bulkDelete("mahasiswa", null, {});
  },
};
