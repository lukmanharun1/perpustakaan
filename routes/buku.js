const express = require("express");
const router = express.Router();

const controller = require("../controller/buku");
// const validate = require("../middleware/validate");
// const validation = require("../validation/buku");
const { getBukuRedis } = require("../middleware/redis");

router.get("/", getBukuRedis, controller.getAll);

module.exports = router;
