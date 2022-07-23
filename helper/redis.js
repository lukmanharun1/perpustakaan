const redisConnection = require("../config/redis");

const deleteKeys = async (keys) => {
  const result = await redisConnection.keys(keys);
  if (result.length > 0) {
    await redisConnection.del(result);
    return true;
  }
  return false;
};

module.exports = {
  deleteKeys,
};
