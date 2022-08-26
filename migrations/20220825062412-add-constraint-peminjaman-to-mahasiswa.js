"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("peminjaman", {
      fields: ["id_mahasiswa"],
      name: "peminjaman.id_mahasiswa",
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
    await queryInterface.removeConstraint(
      "peminjaman",
      "peminjaman.id_mahasiswa"
    );
  },
};
