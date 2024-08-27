const { createClient } = require("redis");
const config = require("../config/index");
const writer_client = createClient({
    socket: {
        host: config.REDIS.WRITER_HOST,
        port: Number(config.REDIS.PORT),
    },
});
const reader_client = createClient({
    socket: {
        host: config.REDIS.READER_HOST,
        port: Number(config.REDIS.PORT),
    },
});
writer_client.on("error", err => console.error("Error occured on redis writer", err));
reader_client.on("error", err => console.error("Error occured on redis reader", err));
writer_client.connect();
reader_client.connect();
module.exports = { redis_writer_client: writer_client, redis_reader_client: reader_client };