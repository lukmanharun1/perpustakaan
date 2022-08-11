const { body } = require("express-validator");

const create = () => [
  body("tanggal_pengembalian").notEmpty().isDate({ format: "YYYY-MM-DD" }),
  body("id_peminjaman").notEmpty().isUUID(),
  body("status").optional().isIn(["rusak", "hilang"]),
  body("nominal").custom((nominal, { req }) => {
    if (req.body.status && !nominal) {
      throw new Error("nominal wajib diisi!");
    } else if (nominal) {
      if (typeof nominal !== "number") {
        throw new Error("nominal harus number!");
      } else if (nominal < 500) {
        throw new Error("nominal minimal haru 500");
      }
    }
    return true;
  }),
];

module.exports = {
  create,
};
