const os = require("os");
const { Sequelize, BaseError: sequelizeBaseError } = require("sequelize");
const BaseError = require("./baseError");
const { modifyDateFormat, date_format, defaultTimezone } = require("../date_format");



// function logErrorMiddleware(err, req, res, next) {
//     logError(err);
//     next(err);
// }

function returnError(err, req, res, next) {
    if (err.response) {
        err.statusCode = err.response.status;
        err.message = err.response.data.errors.message;
    }

    const status = err.statusCode || 400;
    const message = err.message || "something went wrong";
    // logError(err);
    sendErrorLogs(err, req);
    res.status(err.statusCode || 400);
    res.json({
        errors: {
            message: message,
            status,
            ...err,
        },
    });
}

function notFound(req, res, next) {
    const status = 404;
    res.status(status).send({
        errors: {
            message: "Route not found",
            statusCode: status,
        },
    });
}

function isOperationalError(error) {
    if (error instanceof BaseError) {
        return error.isOperational;
    }
    return false;
}

function sendErrorLogs(err, req) {
    return new Promise(async (resolve, reject) => {
        try {
            const hostname = os.hostname();
            let errorLogObj = {
                "service-name": "service-friends",
                hostname: hostname,
                timestamp: modifyDateFormat(new Date(), date_format, defaultTimezone),
                message: err.message || err,
            };
            if (req.url) {
                errorLogObj.url = req.url;
            }
            if (req.method) {
                errorLogObj.method = req.method;
            }
            if (req.body) {
                errorLogObj.body = req.body;
            }
            if (req.params) {
                errorLogObj.params = req.params;
            }
            if (req.query) {
                errorLogObj.query = req.query;
            }
            if (
                err instanceof sequelizeBaseError ||
                err instanceof redis.ErrorReply ||
                err instanceof redis.ConnectionTimeoutError ||
                (err.code === "ECONNABORTED" && err.message.includes("timeout"))
            ) {
                errorLogObj.errType = "critical";
                if (err instanceof sequelizeBaseError) {
                    errorLogObj.source = "sequelize";
                } else if (err instanceof redis.ErrorReply || err instanceof redis.ConnectionTimeoutError) {
                    errorLogObj.source = "redis";
                } else {
                    errorLogObj.source = "service";
                }
            } else {
                errorLogObj.errType = "warning";
            }
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    // logError,
    // logErrorMiddleware,
    returnError,
    isOperationalError,
    notFound,
};
