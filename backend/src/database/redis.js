const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL;

let redisClient = null;

if (redisUrl) {
  redisClient = createClient({ url: redisUrl });

  redisClient.on('error', (err) => {
    console.error('Redis Error:', err);
  });

  (async () => {
    try {
      await redisClient.connect();
      console.log('Redis Connected');
    } catch (error) {
      console.error('Redis connection failed:', error);
    }
  })();
} else {
  console.warn('REDIS_URL is not set. Redis features will be unavailable.');
}

module.exports = redisClient;