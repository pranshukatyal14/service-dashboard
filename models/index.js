// var config = require("../config/index")(process.env.NODE_ENV);
var config = require("../config/index");


const Sequelize = require("sequelize");
const {
    beforeBulkCreateHook,
    afterBulkCreateHook,
    beforeBulkUpdateHook,
    afterBulkUpdateHook,
    beforeCreateHook,
    afterCreateHook,
    beforeUpdateHook,
    afterUpdateHook,
    beforeUpsertHook,
    afterUpsertHook,
    beforeFindHook,
    afterFindHook,
    beforeCountHook,
    beforeQueryHook,
    afterQueryHook,
} = require("../logger/sequelize.hooks");
var sequelize = new Sequelize(config.mysql.DB, null, null, {
    dialect: config.mysql.dialect,
    operatorsAliases: 0,
    define: {
        timestamps: false,
        // hooks: {
        //   beforeBulkCreate: beforeBulkCreateHook,
        //   afterBulkCreate: afterBulkCreateHook,
        //   // beforeBulkDestroy(options) {
        //   //   console.log("beforeBulkDestroy");
        //   // },
        //   // afterBulkDestroy(options) {
        //   //   console.log("afterBulkDestroy");
        //   // },
        //   beforeBulkUpdate: beforeBulkUpdateHook,
        //   afterBulkUpdate: afterBulkUpdateHook,
        //   beforeCreate: beforeCreateHook,
        //   afterCreate: afterCreateHook,
        //   // beforeDestroy(instance, options) {
        //   //   console.log("beforeDestroy");
        //   // },
        //   // afterDestroy(instance, options) {
        //   //   console.log("afterDestroy");
        //   // },
        //   beforeUpdate: beforeUpdateHook,
        //   afterUpdate: afterUpdateHook,
        //   // beforeSave(instance, options) {
        //   //   console.log("beforeSave");
        //   // },
        //   // afterSave(instance, options) {
        //   //   console.log("afterSave");
        //   // },
        //   beforeUpsert: beforeUpsertHook,
        //   afterUpsert: afterUpsertHook,
        //   beforeFind: beforeFindHook,
        //   afterFind: afterFindHook,
        //   beforeCount: beforeCountHook,
        //   beforeQuery: beforeQueryHook,
        //   afterQuery: afterQueryHook,
        // }
    },
    port: config.mysql.port,
    replication: {
        read: [{ host: config.mysql.slave_host, username: config.mysql.slave_user, password: config.mysql.slave_password }],
        write: { host: config.mysql.master_host, username: config.mysql.master_user, password: config.mysql.master_password },
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.watchfacesMaster = require("./user.model")(sequelize, Sequelize);


module.exports = db;
