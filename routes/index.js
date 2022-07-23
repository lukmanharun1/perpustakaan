const express = require("express");
const router = express.Router();
const buku = require("./buku");

router.use("/buku", buku);
module.exports = router;
