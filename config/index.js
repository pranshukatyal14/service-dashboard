let config = require("./config.json");
const RUN_ENV = process.env.NODE_ENV ?? "dev";

let configData = config[RUN_ENV];
module.exports = {
    ...configData,
    RUN_ENV: RUN_ENV,
};
