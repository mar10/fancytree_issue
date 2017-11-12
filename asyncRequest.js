"use strict";
const {ipcRenderer} = require("electron");
const uniqueRandom = require("unique-random");
const rand = uniqueRandom(1, 999999);

const sendMsg = function (requestName, msg) {
    const requestId = rand();
    const responseChannel = `${requestName}-${requestId}`;
    const promise = new Promise(function (resolve, reject) {
        try {
            ipcRenderer.on(responseChannel, function(origin, data){
                console.log("response=" + JSON.stringify(origin), JSON.stringify(data));
                ipcRenderer.removeAllListeners(responseChannel);
                return resolve({origin, data});
            });
        } catch (err) {
            return reject(err);
        }
    });
    ipcRenderer.send(requestName, {
        id: responseChannel,
        param: msg
    });
    return promise;
};

module.exports = {
    fromWebPage: {
       "async": {
           sendMsg
       }
    },
    fromMain: {
    }
};
