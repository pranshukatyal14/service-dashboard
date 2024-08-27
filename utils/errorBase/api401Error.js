const BaseError = require("./baseError");

class Api401Error extends BaseError {
    constructor(description = "session expired, please login again") {
        super(401, description);
    }
}

module.exports = Api401Error;
