const { body } = require("express-validator");
const nominal = require("./custom/nominal");
const create = () => [
  body("id_buku").isUUID(),
  body("id_mahasiswa").isUUID(),
  body("status").isIn(["rusak", "hilang"]),
  body("nominal").custom(nominal),
];

module.exports = {
  create,
};
