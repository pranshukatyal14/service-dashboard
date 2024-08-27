let redisUtils = require("../utils/redisKeys");
const statusCodes = require("../utils/errorBase/httpStatusCodes");
const { successRes } = require("../utils/successBase/response");
const Api400Error = require("../utils/errorBase/api400Error");


exports.healthCheck = async (req, res, next) => {
    try {
        res.status(statusCodes.OK).json({ success: true });
    } catch (error) {
        next(error);
    }
};


exports.login = async (req, res, next) => {
    try {
        let {body}=req;
        let {username,password}=body;
        if(username=="pranshu" && password=="pranshu"){
            res.status(statusCodes.OK).json({ success: true });
        }
        res.status(statusCodes.OK).json({ success: true });
    } catch (error) {
        next(error);
    }
};

