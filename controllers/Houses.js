'use strict';

var url = require('url');


var HOUSES = require('./HOUSESService');


module.exports.housesHOUSEIDDELETE = function housesHOUSEIDDELETE (req, res, next) {
  HOUSES.housesHOUSEIDDELETE(req.swagger.params, res, next);
};

module.exports.housesHOUSEIDGET = function housesHOUSEIDGET (req, res, next) {
  HOUSES.housesHOUSEIDGET(req.swagger.params, res, next);
};

module.exports.housesHOUSEIDPUT = function housesHOUSEIDPUT (req, res, next) {
  HOUSES.housesHOUSEIDPUT(req.swagger.params, res, next);
};

module.exports.housesPOST = function housesPOST (req, res, next) {
  HOUSES.housesPOST(req.swagger.params, res, next);
};
