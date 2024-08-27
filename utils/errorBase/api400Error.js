const BaseError = require("./baseError");

class Api400Error extends BaseError {
    constructor(description = "Bad Request") {
        super(400, description);
    }
}

module.exports = Api400Error;
