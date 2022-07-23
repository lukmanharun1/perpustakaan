const express = require("express");
const router = express.Router();

const controller = require("../controller/buku");
const validate = require("../middleware/validate");
const validation = require("../validation/buku");
const { getBukuRedis } = require("../middleware/redis");

router.get("/", validation.getAll(), validate, getBukuRedis, controller.getAll);
router.post("/", validation.create(), validate, controller.create);
router.put("/", validation.update(), validate, controller.update);

module.exports = router;
