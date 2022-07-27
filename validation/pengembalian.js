const { body } = require("express-validator");

const create = () => [
  body("tanggal_pengembalian").notEmpty().isDate({ format: "YYYY-MM-DD" }),
  body("id_peminjaman").notEmpty().isUUID(),
  body("status").optional().isIn(["rusak", "hilang"]),
];

module.exports = {
  create,
};
