'use strict';

var url = require('url');


var USERS = require('./USERSService');


module.exports.usersPOST = function usersPOST (req, res, next) {
  USERS.usersPOST(req.swagger.params, res, next);
};

module.exports.usersUSERIDDELETE = function usersUSERIDDELETE (req, res, next) {
  USERS.usersUSERIDDELETE(req.swagger.params, res, next);
};

module.exports.usersUSERIDGET = function usersUSERIDGET (req, res, next) {
  USERS.usersUSERIDGET(req.swagger.params, res, next);
};

module.exports.usersUSERIDPUT = function usersUSERIDPUT (req, res, next) {
  USERS.usersUSERIDPUT(req.swagger.params, res, next);
};
