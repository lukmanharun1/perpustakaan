const express = require("express");
const router = express.Router();

const controller = require("../controller/buku");
const validate = require("../middleware/validate");
const validation = require("../validation/buku");
const { getBukuRedis, getBukuByIdRedis } = require("../middleware/redis");

router.get("/", validation.getAll(), validate, getBukuRedis, controller.getAll);
router.post("/", validation.create(), validate, controller.create);
router.put("/:id", validation.update(), validate, controller.update);
router.get(
  "/:id",
  validation.getById(),
  validate,
  getBukuByIdRedis,
  controller.getById
);
router.patch(
  "/:id",
  validation.updateNamaRakBuku(),
  validate,
  controller.updateNamaRakBuku
);

module.exports = router;
