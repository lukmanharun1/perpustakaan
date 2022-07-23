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

module.exports = {
  getBukuRedis,
};
