// var config = require("../config")(process.env.NODE_ENV);
var config = require("../config/index");

const axios = require("axios");

exports.fetchDeviceFeatures = (platform,device_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            let feaatures = await axios.get(config.USER_DETAIL_APP_URL  + `/user_detail/watch/device_features?platform=${platform}&device_id=${device_id}`)
            resolve(feaatures.data.data.device_features)
        }catch(error){
            reject(error)
        }
    })
}