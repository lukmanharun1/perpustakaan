const express = require("express");
const router = express.Router();

const controller = require("../controller/mahasiswa");
const validate = require("../middleware/validate");
const { getMahasiswaRedis } = require("../middleware/redis");
const validation = require("../validation/mahasiswa");

router.get("/", getMahasiswaRedis, controller.getAll);

module.exports = router;
