"use strict";

const dataBukuSeeder = require("../constant/buku-seeder");
const { Buku } = require("../models");
module.exports = {
  async up(queryInterface, Sequelize) {
    const dataBuku = await dataBukuSeeder();
    await Promise.all(
      await dataBuku.map(async (data) => {
        try {
          await Buku.findOrCreate({
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
    await queryInterface.bulkDelete("buku", null, {});
  },
};
