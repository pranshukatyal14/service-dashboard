"use strict";

const { EventEmitter } = require("events");

const server = require("./server/server");
var config = require("./config/index");
var APP_PORT = process.env.APP_PORT || config.APP_PORT;

var config = require("./config/index");

var APP_PORT = process.env.APP_PORT || config.APP_PORT;
const mongoose = require('mongoose');


const startApp = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb+srv://pranshumongo:MKKhmtal1zpiyQvO@cluster0.4w5mb.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

        // Start the server
        await server.start({ port: APP_PORT, repo: true, isSelf: true });
        console.log(`Server started successfully. Running on port: ${APP_PORT}`);

        // Handle PM2 deployment
        if (process.env.PM2_DEPLOY) {
            process.send("ready");
            process.on("SIGINT", async (msg) => {
                console.log("Process reload ongoing message: " + msg);
                await mongoose.connection.close();
                process.exit(0);
            });
            process.on("message", (msg) => {
                if (msg === "shutdown") {
                    console.log("Closing all connections...");
                    setTimeout(async () => {
                        await mongoose.connection.close();
                        console.log("Finished closing connections");
                        process.exit(0);
                    }, 1500);
                }
            });

            const instanceSeq = process.env.INSTANCE_ID || "0";
            if (instanceSeq === "0") {
                console.log("Master Instance");
            } else {
                console.log("Slave Instance");
            }
        }

    } catch (error) {
        console.error("Error starting the application:", error);
        process.exit(1);
    }
};

startApp();