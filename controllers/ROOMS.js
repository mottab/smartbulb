'use strict';

var url = require('url');


var ROOMS = require('./ROOMSService');


module.exports.roomsPOST = function roomsPOST (req, res, next) {
  ROOMS.roomsPOST(req.swagger.params, res, next);
};

module.exports.roomsROOMIDDELETE = function roomsROOMIDDELETE (req, res, next) {
  ROOMS.roomsROOMIDDELETE(req.swagger.params, res, next);
};

module.exports.roomsROOMIDGET = function roomsROOMIDGET (req, res, next) {
  ROOMS.roomsROOMIDGET(req.swagger.params, res, next);
};

module.exports.roomsROOMIDPUT = function roomsROOMIDPUT (req, res, next) {
  ROOMS.roomsROOMIDPUT(req.swagger.params, res, next);
};
