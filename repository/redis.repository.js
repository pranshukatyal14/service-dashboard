const redis = require("redis");
// const config = require("../config/index")(process.env.NODE_ENV);
var config = require("../config/index");
const { logger } = require("../logger/winston");

const generalUTILS = require("../utils/general");
const {redis_reader_client,redis_writer_client}=require("./client")

const repository = () => {
    const deleteRedisKey = key => {
        return new Promise(async (resolve, reject) => {
            try {
                redis_writer_client.del(key);
                resolve("Successfully deleted key", key);
            } catch (err) {
                reject(err);
            }
        });
    };

    const deleteRedisKeysPattern = keyPattern => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await redis_writer_client.keys(keyPattern + "*");
                for (let i = 0; i < result.length; i++) {
                    redis_writer_client.del(result[i]);
                }
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    };

    const setInCache = (key, value) => {
        return new Promise(async (resolve, reject) => {
            try {
                redis_writer_client.set(key, JSON.stringify(value));
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    };

    const fetchFromCache = key => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await redis_reader_client.get(key);
                if (result != null) {
                    resolve(JSON.parse(result));
                } else {
                    resolve(null);
                }
            } catch (err) {
                if (err.code === "ETIMEDOUT") {
                    resolve(null);
                } else {
                    reject(err);
                }
            }
        });
    };

    const setIntoCacheWithExpire = (key, expire, value) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (generalUTILS.isEmpty(expire)) {
                    expire = parseInt((new Date().setHours(23, 59, 59, 999) - new Date()) / 1000); //will expire at end of the day
                }
                redis_writer_client.set(key, JSON.stringify(value), { EX: expire, NX: false });
                resolve(true);
            } catch (err) {
                reject(err);
            }
        });
    };

    const setListInCache = (key, element) => {
        return new Promise(async (resolve, reject) => {
            try {
                await redis_writer_client.RPUSH(key, JSON.stringify(element));
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    };

    const getListFromCache = (key, skip = 0, limit = -1) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await redis_reader_client.LRANGE(key, skip, limit);
                const parsedList = [];
                for (let i = 0; i < result.length; i++) {
                    !parsedList.includes(result[i]) && parsedList.push(JSON.parse(result[i]));
                }
                resolve(parsedList);
            } catch (error) {
                reject(error);
            }
        });
    };

    const setExpiryInCache = (key, expiry) => {
        return new Promise(async (resolve, reject) => {
            try {
                await redis_writer_client.expire(key, expiry);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    };

    const setHash = (key, f) => {
        return new Promise(async (resolve, reject) => {
            try {
                const args = [];
                for (const [field, value] of Object.entries(f)) {
                    args.push(field, value);
                }
                await redis_writer_client.hSet(key, [...args]);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    };

    const getAllHash = key => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await redis_reader_client.hGetAll(key);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
    };

    const getHash = (key, field) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await redis_reader_client.hGet(key, field);
                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
    };

    const deleteHash = (key, field) => {
        return new Promise(async (resolve, reject) => {
            try {
                await redis_reader_client.hDel(key, field.toString());
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    };

    const setHashWithExpiry = (key, f, expires_in) => {
        return new Promise(async (resolve, reject) => {
            try {
                const args = [];
                for (const [field, value] of Object.entries(f)) {
                    args.push(field, value);
                }
                await redis_writer_client.hSet(key, [...args]);

                await redis_writer_client.expire(key, expires_in);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    };

    return {
        deleteRedisKey,
        setListInCache,
        getListFromCache,
        setExpiryInCache,
        deleteRedisKeysPattern,
        setInCache,
        fetchFromCache,
        setIntoCacheWithExpire,
        setHash,
        getAllHash,
        getHash,
        deleteHash,
        setHashWithExpiry,
    };
};

module.exports = repository();
