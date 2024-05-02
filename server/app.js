const express = require("express");
const mongoose = require('mongoose');
const redis = require("redis");

const app = express();

// Create a Redis client
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379,
});

// Error handling for Redis client
redisClient.on("error", function(error) {
    console.error("Error connecting to Redis:", error);
});

// Log message when Redis client connects successfully
redisClient.on("connect", function() {
    console.log("Redis connected successfully");
});

// Middleware to handle caching logic
const cacheMiddleware = (req, res, next) => {
    const cacheKey = 'products';

    // Check if Redis client is connected
    if (!redisClient.connected) {
        console.error("Redis client is not connected");
        return next(); // Continue without cache if Redis client is not connected
    }

    // Check if data exists in cache
    redisClient.get(cacheKey, (err, data) => {
        if (err) {
            console.error("Error retrieving data from Redis:", err);
            return next(); // Continue without cache if there's an error
        }

        if (data !== null) {
            console.log('Data retrieved from cache');
            res.json(JSON.parse(data));
        } else {
            next();
        }
    });
};

app.get('/api/cart', cacheMiddleware, async (req, res) => {
    try {
        const dbobj = mongoose.connection;
        const productdata = await dbobj.collection('products').find().toArray();

        // Cache data using Redis
        redisClient.setex('products', 3600, JSON.stringify(productdata), (err, reply) => {
            if (err) {
                console.error("Error caching data in Redis:", err);
            } else {
                console.log("Data cached in Redis");
            }
        });

        res.status(200).json(productdata);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const port = 6000;
mongoose.connect("mongodb+srv://admin:admin@cluster0.xqw3dcj.mongodb.net/ArgoOrgan").then(() => {
    app.listen(port, () => {
        console.log(`Server is running on ${port}`);
    });
}).catch((err) => console.log(err));
