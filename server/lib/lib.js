const Redis = require('ioredis');

const client = new Redis({
    password: 'U4h5y1mDKkBF1kKtxi8LPvzdarvHguIO',
    host: 'redis-19560.c264.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 19560
});



module.exports= client

// Error handling for Redis client

