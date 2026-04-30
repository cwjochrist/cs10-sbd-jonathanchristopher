const { createClient } = require("redis");

const redisClient = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

(async () => {
  await redisClient.connect();
  console.log("Redis Connected");
})();

module.exports = redisClient;