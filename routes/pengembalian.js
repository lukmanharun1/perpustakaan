const express = require("express");
const router = express.Router();

const controller = require("../controller/pengembalian");
const validate = require("../middleware/validate");
const validation = require("../validation/pengembalian");

router.post("/", validation.create(), validate, controller.create);

module.exports = router;
