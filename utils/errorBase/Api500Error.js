const BaseError = require("./baseError");

class Api500Error extends BaseError {
    constructor(description = "something went wrong") {
        super(500, description);
    }
}

module.exports = Api500Error;
