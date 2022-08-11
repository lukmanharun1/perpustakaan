const { body } = require("express-validator");

const create = () => [
  body("tanggal_pengembalian").notEmpty().isDate({ format: "YYYY-MM-DD" }),
  body("id_peminjaman").notEmpty().isUUID(),
  body("status").optional().isIn(["rusak", "hilang"]),
  body("nominal")
    .optional()
    .isInt({ min: 500 })
    .custom((nominal, { req }) => {
      if (req.status && !nominal) {
        throw new Error("nominal wajib diisi!");
      }
      return true;
    }),
];

module.exports = {
  create,
};
