const { param, body } = require("express-validator");

const getById = () => [param("id").notEmpty().isUUID()];

const create = () => [
  body("jurusan").isString().isLength({ min: 2, max: 128 }),
  body("no_telp").isString().isNumeric().isLength({ min: 11, max: 13 }),
  body("alamat").isString().isLength({ min: 20, max: 255 }),
  body("nama_lengkap").isString().isLength({ min: 3, max: 128 }),
];

const update = () => [
  param("id").notEmpty().isUUID(),
  body("jurusan").optional().isString().isLength({ min: 2, max: 128 }),
  body("no_telp")
    .optional()
    .isString()
    .isNumeric()
    .isLength({ min: 11, max: 13 }),
  body("alamat").optional().isString().isLength({ min: 20, max: 255 }),
  body("nama_lengkap").optional().isString().isLength({ min: 3, max: 128 }),
];

const destroy = () => [param("id").notEmpty().isUUID()];

module.exports = {
  getById,
  create,
  update,
  destroy,
};
