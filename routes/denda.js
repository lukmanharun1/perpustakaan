const express = require("express");
const router = express.Router();

const controller = require("../controller/denda");
const validate = require("../middleware/validate");
const validation = require("../validation/denda");

router.post("/", validation.create(), validate, controller.create);
router.get("/", controller.getAll);

module.exports = router;
