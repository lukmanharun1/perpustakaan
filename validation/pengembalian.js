const { body } = require("express-validator");

const create = () => [
  body("tanggal_pengembalian").notEmpty().isDate({ format: "YYYY-MM-DD" }),
  body("id_peminjaman").notEmpty().isUUID(),
];

module.exports = {
  create,
};
