const express = require("express");
const router = express.Router();
const buku = require("./buku");
const peminjaman = require("./peminjaman");
const pengembalian = require("./pengembalian");
const denda = require("./denda");
const mahasiswa = require("./mahasiswa");

router.use("/buku", buku);
router.use("/peminjaman", peminjaman);
router.use("/pengembalian", pengembalian);
router.use("/denda", denda);
router.use("/mahasiswa", mahasiswa);
module.exports = router;
