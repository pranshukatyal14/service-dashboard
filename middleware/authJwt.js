const axios = require("axios");
// var config = require("../config/index")(process.env.NODE_ENV);
var config = require("../config/index");

const GENERAL_UTILs = require("../utils/general");
const statusCodes = require("../utils/errorBase/httpStatusCodes");
const responseMessages = require("../utils/errorBase/apiResponseMessage");
const Api401Error = require("../utils/errorBase/api401Error");

auth = async (req, res, next) => {
    try {
        const token = req.header("User-Auth-Token");
        const access_token = req.header("access-token");
        const wearable_type = req.header("wearable-type");
        if (access_token) {
            const response = await axios.get(config.AUTH_V2_URL + "/auth_v2/auth/user", { headers: { "access-token": access_token, "wearable-type": wearable_type } });
            req.user = response.data.data;
        }

        if (token) {
            const user = await axios.get(config.AUTH_BASE_URL + "/auth/token", { headers: { "User-Auth-Token": token } });
            if (GENERAL_UTILs.isEmpty(user)) {
                throw new Api401Error(responseMessages.UNAUTHORIZED);
            }
            req.user = user.data.data;
        }

        if (!token && !access_token) {
            throw new Api401Error(responseMessages.UNAUTHORIZED);
        }

        next();
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            error.statusCode = 401;
            error.message = "Auth service not available";
        }
        next(error);
    }
};

auth_detail = async (req, res, next) => {
    try {
        const token = req.header("User-Auth-Token");
        const access_token = req.header("access-token");
        const wearable_type = req.header("wearable-type");
        if (access_token) {
            const response = await axios.get(config.AUTH_V2_URL + "/auth_v2/auth/detail/user", { headers: { "access-token": access_token, "wearable-type": wearable_type } });
            req.user = response.data.data;
        }

        if (token) {
            const user = await axios.get(config.AUTH_BASE_URL + "/auth/token", { headers: { "User-Auth-Token": token } });
            if (GENERAL_UTILs.isEmpty(user)) {
                throw new Api401Error(responseMessages.UNAUTHORIZED);
            }
            req.user = user.data.data;
        }

        if (!token && !access_token) {
            throw new Api401Error(responseMessages.UNAUTHORIZED);
        }

        next();
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            error.statusCode = 401;
            error.message = "Auth service not available";
        }
        next(error);
    }
};

deviceAuth = async (req, res, next) => {
    try {
        const token = req.header("User-Auth-Token");
        const deviceToken = req.header("Device-External-Id");
        const access_token = req.header("access-token");
        const wearable_type = req.header("wearable-type");
        if (access_token) {
            const response = await axios.get(config.AUTH_V2_URL + "/auth_v2/auth/device", { headers: { "access-token": access_token, "wearable-type": wearable_type } });
            req.userDevice = response.data.data;
        }
        if (token) {
            if (!deviceToken) {
                throw new Api401Error(responseMessages.INVALID);
            }

            const headers = {
                "User-Auth-Token": token,
                "Device-External-Id": deviceToken != undefined ? deviceToken : "",
            };

            const response = await axios.get(config.AUTH_BASE_URL + "/auth/device_token", { headers: headers });

            if (GENERAL_UTILs.isEmpty(response)) {
                throw new Api401Error(responseMessages.UNAUTHORIZED);
            }
            // req.userDevice = response.data.data.userDevice;
            // req.user = response.data.data.user;

            req.userDevice = response.data.data;
        }

        if (!token && !access_token) {
            throw new Api401Error(responseMessages.UNAUTHORIZED);
        }

        next();
    } catch (error) {
        if (error.code === "ECONNREFUSED") {
            error.statusCode = 401;
            error.message = "Auth service not available";
        }
        next(error);
    }
};

const authJwt = {
    auth,
    deviceAuth,
    auth_detail,
};

module.exports = authJwt;
