const { param } = require("express-validator");

const getById = () => [param("id").notEmpty().isUUID()];

module.exports = {
  getById,
};
