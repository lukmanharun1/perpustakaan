const { body } = require("express-validator");

const create = () => [
  body("id_buku").notEmpty().isUUID(),
  body("id_mahasiswa").notEmpty().isUUID(),
  body("status").isIn(["rusak", "hilang"]),
];

module.exports = {
  create,
};
