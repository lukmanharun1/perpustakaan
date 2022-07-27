const { body } = require("express-validator");

const create = () => [
  body("id_buku").isUUID(),
  body("id_mahasiswa").isUUID(),
  body("status").isIn(["rusak", "hilang"]),
];

module.exports = {
  create,
};
