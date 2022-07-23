const { query, body, param } = require("express-validator");
const tahunSekarang = new Date().getFullYear();
const getAll = () => [
  query("judul_buku").optional().isString(),
  query("nama_penulis").optional().isString(),
  query("nama_penerbit").optional().isString(),
  query("tahun_penerbit")
    .optional()
    .isString()
    .isLength({ min: 4, max: 4 })
    .isInt({ min: 1990, max: tahunSekarang + 1 }),
  query("nama_rak_buku").optional().isString(),
];

const create = () => [
  body("judul_buku").notEmpty().isString(),
  body("nama_penulis").notEmpty().isString(),
  body("nama_penerbit").notEmpty().isString(),
  body("tahun_penerbit")
    .notEmpty()
    .isString()
    .isLength({ min: 4, max: 4 })
    .isInt({ min: 1990, max: tahunSekarang }),
  body("stok").notEmpty().isInt({ min: 1, max: 10000 }),
  body("nama_rak_buku").notEmpty().isString(),
];

const update = () => [
  param("id").notEmpty().isUUID(),
  body("judul_buku").optional().isString(),
  body("nama_penulis").optional().isString(),
  body("nama_penerbit").optional().isString(),
  body("tahun_penerbit")
    .optional()
    .isString()
    .isLength({ min: 4, max: 4 })
    .isInt({ min: 1990, max: tahunSekarang }),
  body("stok").optional().isInt({ min: 1, max: 10000 }),
];

module.exports = {
  getAll,
  create,
  update,
};
