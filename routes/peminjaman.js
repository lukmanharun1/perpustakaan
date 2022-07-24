const express = require("express");
const router = express.Router();

const controller = require("../controller/peminjaman");
const validate = require("../middleware/validate");
const validation = require("../validation/peminjaman");

router.post("/", validation.create(), validate, controller.create);

module.exports = router;
