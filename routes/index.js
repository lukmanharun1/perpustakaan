const express = require("express");
const router = express.Router();
const buku = require("./buku");
const peminjaman = require("./peminjaman");
const pengembalian = require("./pengembalian");

router.use("/buku", buku);
router.use("/peminjaman", peminjaman);
router.use("/pengembalian", pengembalian);
module.exports = router;
