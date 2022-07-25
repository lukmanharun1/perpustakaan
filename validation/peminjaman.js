const { body } = require("express-validator");

const create = () => [
  body("tanggal_pengembalian")
    .notEmpty()
    .isDate({ format: "YYYY-MM-DD" })
    .custom((tanggal_pengembalian) => {
      const tanggalSekarang = new Date().toISOString().split("T")[0];
      if (tanggalSekarang > tanggal_pengembalian) {
        throw new Error("Tanggal pengembalian tidak valid!");
      }
      return true;
    }),
  body("id_buku").notEmpty().isUUID(),
  body("id_mahasiswa").notEmpty().isUUID(),
];

module.exports = {
  create,
};
