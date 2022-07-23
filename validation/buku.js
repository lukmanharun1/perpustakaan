const { query } = require("express-validator");

const getAll = () => [
  query("judul_buku").optional().isString(),
  query("nama_penulis").optional().isString(),
  query("nama_penerbit").optional().isString(),
  query("tahun_penerbit").optional().isString().isLength({ max: 4 }),
  query("nama_rak_buku").optional().isString(),
];

module.exports = {
  getAll,
};
