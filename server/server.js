"use strict";
const spdy = require("spdy");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const UserAPi = require("../api/users");

// const watchFacesMasterAPI=require('../api/watchFacesMaster');
const { returnError, notFound } = require("../utils/errorBase/errorHandler");
const moment =require("moment")


const start = (options) => {
    return new Promise((resolve, reject) => {
      
        if (!options.port) {
            reject(new Error("The server must be started with an available port"));
        }
        const app = express();
        app.use((req, res, next) => {
        
            next();
        });
        app.use(
            morgan((tokens, req, res) => {
                return (
                    moment().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") +
                    " " +
                    tokens.method(req, res) +
                    " " +
                    tokens.url(req, res) +
                    " " +
                    tokens.status(req, res) +
                    " " +
                    tokens["response-time"](req, res) +
                    " ms"
                );
            })
        );
        app.use(helmet());
        app.use((err, req, res, next) => {
            reject(new Error("Something went wrong! Error:" + err));
            res.status(500).send("Something went wrong!");
        });

        // Add middleware to handle post requests
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.get("/", (req, res, next) => {
            res.status(200).json("ok");
        });

        UserAPi(app, options);
       
        app.use(returnError);
        app.use(notFound);
        app.listen(options.port, () => {
            const message = `|| 🔉 server started succesfully. Running on port: ${options.port} ||`;
            console.log(message)
            const len = message.length;
          
        });

       
    });
};

process.on("uncaughtException", (err) => {
    console.error("Unhandled Exception", err);
    apm.captureError(err);
    apm.endTransaction();
    apm.flush(function () {
        // process.exit(1);
    });
    // throw err;
});

process.on("uncaughtRejection", (error, promise) => {
    console.error("Unhandled Rejection", error);
    throw error;
});

module.exports = Object.assign({}, { start });
