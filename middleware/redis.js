const redisConnection = require("../config/redis");
const response = require("../helper/response");

const getBukuRedis = async (req, res, next) => {
  const getBuku = await redisConnection.get(
    `getBuku:${JSON.stringify(req.query)}`
  );
  if (getBuku !== null) {
    return response(res, {
      status: "success",
      data: JSON.parse(getBuku),
    });
  }
  console.log("data tidak ada di dalam redis");
  next();
};

const getBukuByIdRedis = async (req, res, next) => {
  const getBuku = await redisConnection.get(
    `getBuku:${JSON.stringify(req.params.id)}`
  );
  if (getBuku !== null) {
    return response(res, {
      status: "success",
      data: JSON.parse(getBuku),
    });
  }
  console.log("data tidak ada di dalam redis");
  next();
};

const getMahasiswaRedis = async (req, res, next) => {
  const getMahasiswa = await redisConnection.get("getMahasiswa:");
  if (getMahasiswa !== null) {
    return response(res, {
      status: "success",
      data: JSON.parse(getMahasiswa),
    });
  }
  console.log("data tidak ada di dalam redis");
  next();
};

module.exports = {
  getBukuRedis,
  getBukuByIdRedis,
  getMahasiswaRedis,
};
