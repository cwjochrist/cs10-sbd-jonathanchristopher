const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL;

function hasValidRedisProtocol(url) {
  return /^rediss?:\/\//i.test(url);
}

let redisClient = null;

if (redisUrl) {
  if (!hasValidRedisProtocol(redisUrl)) {
    console.warn(
      'REDIS_URL has invalid protocol. Use redis:// or rediss://. Redis features will be unavailable.'
    );
  } else {
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
  }
} else {
  console.warn('REDIS_URL is not set. Redis features will be unavailable.');
}

module.exports = redisClient;