const { createClient } = require("redis");
const client = createClient({
  url: process.env.REDIS_URL,
});

client.connect();
client.on("connect", () => {
  console.log("Redis Client Success Connect");
});

client.on("error", (err) => {
  console.log("Redis Client Error", err);
});

module.exports = client;
