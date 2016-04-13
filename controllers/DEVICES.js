'use strict';

var url = require('url');


var DEVICES = require('./DEVICESService');


module.exports.devicesDEVICEIDDELETE = function devicesDEVICEIDDELETE (req, res, next) {
  DEVICES.devicesDEVICEIDDELETE(req.swagger.params, res, next);
};

module.exports.devicesDEVICEIDGET = function devicesDEVICEIDGET (req, res, next) {
  DEVICES.devicesDEVICEIDGET(req.swagger.params, res, next);
};

module.exports.devicesDEVICEIDPUT = function devicesDEVICEIDPUT (req, res, next) {
  DEVICES.devicesDEVICEIDPUT(req.swagger.params, res, next);
};

module.exports.devicesPOST = function devicesPOST (req, res, next) {
  DEVICES.devicesPOST(req.swagger.params, res, next);
};
