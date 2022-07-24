const { body } = require("express-validator");

const create = () => [
  body("tanggal_peminjaman").notEmpty().isDate(),
  body("tanggal_pengembalian").notEmpty().isDate(),
  body("id_buku").notEmpty().isUUID(),
  body("id_mahasiswa").notEmpty().isUUID(),
];

module.exports = {
  create,
};
