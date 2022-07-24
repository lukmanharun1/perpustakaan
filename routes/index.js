const express = require("express");
const router = express.Router();
const buku = require("./buku");
const peminjaman = require("./peminjaman");

router.use("/buku", buku);
router.use("/peminjaman", peminjaman);
module.exports = router;
