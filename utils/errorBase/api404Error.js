const httpStatusCodes = require("./httpStatusCodes");
const BaseError = require("./baseError");

class Api404Error extends BaseError {
    constructor(description = "Not found.") {
        super(404, description);
    }
}

module.exports = Api404Error;
