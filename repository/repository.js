"use strict";

var config = require("../config/index");
let  UserModel =require("../models/user.model")

async function getUserTasks(userId) {
  try {
    const user = await UserModel.findById(userId);
    return user;
  } catch (err) {
    throw new Error(`Failed to fetch tasks: ${err.message}`);
  }
}




module.exports = {
  getUserTasks
};