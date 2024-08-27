"use strict";

const db = require("../models");

const WatchFacesMaster=db.watchfacesMaster;

const { sequelize, watchfacesMaster, watchfacesdevices } = require("../models");

// const { sequelize, watchfacesMaster } = require("../models");

const repository = () => {
    
   
    

    return {
       
        createCustomWatchface,
        updateCustomWatchfaceBG,
        
    };
};

const connect = () => {
    return new Promise((resolve, reject) => {
        try {
            db.sequelize;
            console.log("Connection has been established successfully.");
            resolve(repository());
        } catch (error) {
            console.error("Unable to connect to the database:", error);
            reject("error connecting: " + error.stack);
        }
    });
};

module.exports = Object.assign({}, { connect });
