"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("denda", {
      fields: ["id_mahasiswa"],
      name: "denda.id_mahasiswa_fk_to_mahasiswa.id",
      type: "foreign key",
      references: {
        table: "mahasiswa",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("denda", "denda.id_mahasiswa");
  },
};
