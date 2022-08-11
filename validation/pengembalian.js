const { body } = require("express-validator");
const nominal = require("./custom/nominal");

const create = () => [
  body("tanggal_pengembalian").notEmpty().isDate({ format: "YYYY-MM-DD" }),
  body("id_peminjaman").notEmpty().isUUID(),
  body("status").optional().isIn(["rusak", "hilang"]),
  body("nominal").custom(nominal),
];

module.exports = {
  create,
};
