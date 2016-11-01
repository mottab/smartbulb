// Copyright 2015, Ibtkar Technologies, Inc.

'use strict';

var extend = require('lodash').assign;
var mysql = require('mysql');
var path = require('path'),
    fs = require('fs');
var config = require('../config');
var images = require('../media/images');



module.exports = function(config) {

	// function getConnection() {
	// 	return mysql.createConnection(extend(
	// 		{database: 'ibtikar_bulb'
	// 	}, config.mysql));
	// }

  /**
    * Description : This function is used to create new user account
    * Input       : Request data.
    * Output      : ErrorMessage and ErrorCode if user already exists or general error
    *               UserObject if success   
  */
  function create(req, cb) {
    var myData = getRegisterationRequestData(req.body);
    // cb(null, JSON.stringify(req.body));
    // return;
    req.getConnection(function(err, connection){
      connection.query('SELECT email from `users` WHERE email = ?', myData.email, function(err, res){
      if (err) { return cb(err); }
      if (res.length == 0) {
        // email is not registered before
        // upload image to gcs - google cloud storage
        // Was an image uploaded? If so, we'll use its public URL
        // in cloud storage.
        if(myData.login_type) {
          myData.imageUrl = "https://graph.facebook.com/"+myData.facebook_id+"/picture?type=large";
        }
        // start insertion query
        connection.query('INSERT INTO `users` SET ?', myData, function(err, res) {
           if (err) { return cb(err); }
           req.params.user = res.insertId;
           read(req, cb);
        });
      } else {
        // email is already registered
        // throw an error
        var err = new Array();
        err.message = "Email is related to another account";
        err.code = 401;
        return cb(err);
      }
      });
    });
  }
  // [END create]
  
  // [START Image]
  function image(req, cb) {
    var myData = req.body;
    var id = req.params.user;
    req.getConnection(function(err, connection){
      if (req.file && req.file.cloudStoragePublicUrl) {
          myData.imageUrl = req.file.cloudStoragePublicUrl;
        }else {
          console.log("kahttab-debug: didn't entered");
        }
        connection.query('UPDATE `users` SET `imageUrl` = ? WHERE `id` = ?', [myData.imageUrl, id], function(err, res){
          if (err) { return cb(err); }
          read(req, cb);
        });
    });
  }
  // [END Image]

  // [START select]
  function read(req, cb) {
    var id = req.params.user;
    req.getConnection(function(err, connection){
      connection.query(
      'SELECT * FROM `users` WHERE `id` = ?', id, function(err, results) {
        if (err) { return cb(err); }
        if (!results.length) {
          return cb({
            code: 401,
            message: 'User is not found'
          });
        }
        cb(null, results[0]);
      });
    });
  }
  // [END select]

  // [START update]
  function update(req, cb) {
    var id = req.params.user, data = req.body;
    var myData = getRegisterationRequestData(data);
    req.getConnection(function(err, connection){
      connection.query(
      'UPDATE `users` SET ? WHERE `id` = ?', [myData, id], function(err) {
        if (err) { return cb(err); }
        read(req, cb);
      });
    });
  }
  // [END update]

  // [START delete]
  function _delete(req, cb) {
    var id = req.params.user;
    req.getConnection(function(err, connection){
      connection.query('DELETE FROM `users` WHERE `id` = ?', id, function(err, res){
      if (err) { return cb(err); }
      cb(null, res[0]);
        // connection.query('DELETE FROM `devices` WHERE ')
      });
    });
  }
  // [END delete]

	return {
	    createSchema: createSchema,
      create: create,
      read: read,
      update: update,
      delete: _delete,
      image: image
  };

};

/**
  * This function is used to map create new user request data into
  * the real database coloums name
  * Inputs: data, hashmap for request body
  * Output: new hashmap of the new keys related to database
*/
function getRegisterationRequestData(data) {
  var newData = {};
  if("un" in data) {
    newData['username'] = data['un'];
  }
  if("uem" in data) {
    newData['email'] = data['uem'];
  }
  if("pass" in data) {
    newData['password'] = data['pass'];
  }
  if("bd" in data) {
    newData['birth_date'] = data['bd'];
  }
  if("lon" in data) {
    newData['longitude'] = data['lon'];
  }
  if("lat" in data) {
    newData['latitude'] = data['lat'];
  }
  // 1 -> normal reg, 2 -> social reg.
  if("lg_type" in data){
    newData['login_type'] = data['lg_type'];
  }
  if("fb_id" in data){
    newData['facebook_id'] = data['fb_id'];
  }

  return newData;
}


if (!module.parent) {
  var prompt = require('prompt');
  prompt.start();

  console.log(
    'Running this script directly will allow you to initialize your mysql ' +
    'database.\n This script will not modify any existing tables.\n');

  prompt.get(['host', 'user', 'password'], function(err, result) {
    if (err) { return; }
    createSchema(result);
  });
}

function createSchema(config) {
  var connection = mysql.createConnection(extend({
    multipleStatements: true
  }, config));

  connection.query(
    "CREATE DATABASE IF NOT EXISTS `ibtikar_bulb` DEFAULT CHARACTER SET = " +
    '\'utf8\' DEFAULT COLLATE \'utf8_unicode_ci\'; ' +
    'USE `ibtikar_bulb`; ' +

    'CREATE TABLE IF NOT EXISTS `ibtikar_bulb`.`apartments` ( ' +
    '`id` int(11) NOT NULL AUTO_INCREMENT, ' +
    '`name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL, ' +
    '`secret_ky` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL, ' +
    '`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
    '`modified_at` timestamp NULL DEFAULT NULL, ' +
    'PRIMARY KEY (`id`));' +
    
    'CREATE TABLE IF NOT EXISTS `ibtikar_bulb`.`devices` ( ' +
    '`id` int(11) NOT NULL AUTO_INCREMENT, ' +
    '`name` varchar(255) COLLATE utf8_unicode_ci NOT NULL, ' +
    '`secret_ky` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL, ' +
    '`room_id` int(11) NOT NULL, ' +
    '`online` tinyint(1) NOT NULL DEFAULT \'0\', ' +
    '`on_off` tinyint(1) NOT NULL DEFAULT \'0\', ' +
    '`hexcolor` varchar(20) COLLATE utf8_unicode_ci NOT NULL DEFAULT \'#ffffff\', ' +
    '`dim_value` int(5) NOT NULL, ' +
    '`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
    '`modified_at` timestamp NULL DEFAULT NULL, ' +
    'PRIMARY KEY (`id`), ' +
    'KEY `room_id` (`room_id`));' +

    'CREATE TABLE IF NOT EXISTS `ibtikar_bulb`.`rooms` ( ' +
    '`id` int(11) NOT NULL AUTO_INCREMENT, ' +
    '`name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL, ' +
    '`secret_ky` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL, ' +
    '`apartment_id` int(11) NOT NULL, ' +
    '`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
    '`modified_at` timestamp NULL DEFAULT NULL, ' +
    'PRIMARY KEY (`id`), ' +
    'KEY `apartment_id` (`apartment_id`));' +
    
    'CREATE TABLE IF NOT EXISTS `ibtikar_bulb`.`users` ( ' +
    '`id` int(11) NOT NULL AUTO_INCREMENT, ' +
    '`username` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL, ' +
    '`email` varchar(128) COLLATE utf8_unicode_ci DEFAULT NULL, ' +
    '`password` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL, ' +
    '`login_type` int(1) DEFAULT 1, '+
    '`facebook_id` varchar(255) utf8_unicode_ci DEFAULT NULL, '+
    '`birth_date` date DEFAULT NULL, ' +
    '`latitude` double DEFAULT NULL, ' +
    '`longitude` double DEFAULT NULL, ' +
    '`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
    '`modified_at` timestamp NULL DEFAULT NULL, ' +
    'PRIMARY KEY (`id`));' +

    'CREATE TABLE IF NOT EXISTS `ibtikar_bulb`.`users_properties` ( ' +
    '`id` int(11) NOT NULL AUTO_INCREMENT, ' +
    '`user_id` int(11) NOT NULL, ' +
    '`device_id` int(11) DEFAULT NULL, ' +
    '`room_id` int(11) DEFAULT NULL, ' +
    '`apartment_id` int(11) DEFAULT NULL, ' +
    '`is_admin` tinyint(1) NOT NULL DEFAULT \'1\', ' +
    '`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
    '`modified_at` timestamp NULL DEFAULT NULL, ' +
    'PRIMARY KEY (`id`), ' +
    'KEY `device_id` (`device_id`), ' +
    'KEY `room_id` (`room_id`), ' +
    'KEY `apartment_id` (`apartment_id`), ' +
    'KEY `user_id` (`user_id`));' +
    function(err) {
      if (err) { throw err; }
      console.log('Successfully created schema');
      
    }
  );
}