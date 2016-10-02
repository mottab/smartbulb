// Copyright 2015, Ibtkar Technologies, Inc.

'use strict';

var extend = require('lodash').assign;
var mysql = require('mysql');

module.exports = function(config) {

	function getConnection() {
		return mysql.createConnection(extend(
			{database: 'ibtikar_bulb'
		}, config.mysql));
	}

  // [START create]
  function createDevice(req, cb) {
    var data = req.body;
    var myData = getDeviceRequestData(data);
    req.getConnection(function(err, connection){
      connection.query("SELECT id FROM `users` WHERE id = ? ", myData.user_id, function(err, res){
        console.log("1")
      if(err) {  return cb(err); }
      if(res.length > 0) {
        console.log("11")
        connection.query('SELECT id FROM `apartments` WHERE id = ?', 
          myData.apartment_id, function(err, res){
            if(err) {  return cb(err); }
            if(res.length > 0) {
              console.log('2')
              connection.query('SELECT id FROM `rooms` WHERE id = ?',
                myData.room_id, function(err, res){
                  if(err) {  return cb(err); }
                  if(res.length > 0) {
                    console.log('3')
                    connection.query('INSERT INTO `devices` SET name=?, room_id=?, secret_ky=?', 
                      [myData.name, myData.room_id, myData.secret_ky], function(err, res){
                      if (err) {  return cb(err); }
                      myData['device_id'] = res.insertId;
                      connection.query('SELECT id FROM `users_properties` WHERE user_id=? AND (apartment_id=? OR room_id=?)', 
                        [myData.user_id, myData.apartment_id, myData.room_id], function(err, res){
                        if(err) {  return cb(err); }
                        if(res.length == 0) {
                          console.log('4')
                          connection.query('INSERT INTO `users_properties` SET user_id=?, device_id=?, is_admin=0', 
                            [myData.user_id, myData.device_id], function (err, res){
                              if(err) {  return cb(err); }
                              return cb(null, res[0]);
                            });
                        }
                      });
                      req.params.device = myData.device_id;
                      readDevice(req, cb);
                    });
                  } else {
                    var err = new Array();
                    err.message = "No Room account is related to this room id";
                    err.code = 401;
                    return cb(err);
                  }
                });
            } else {
              var err = new Array();
              err.message = "No House account is related to this house id";
              err.code = 401;
              return cb(err);
            }
        });
      } else {
        var err = new Array();
        err.message = "No user account is related to this id";
        err.code = 401;
        return cb(err);
      }
    });
    });
  }
  // [END create]

  // [START select]
  function readDevice(req, cb) {
    var id = req.params.device;
    req.getConnection(function(err, connection){
      connection.query(
      'SELECT * FROM `devices` WHERE `id` = ?', id, function(err, results) {
        if (err) {  return cb(err); }
        if (results.length == 0) {
          return cb({
            code: 404,
            message: 'Not found'
          });
        }
        cb(null, results[0]);
      });
    });
  }
  // [END select]

  // [START update]
  function updateDevice(req, cb) {
    var id = req.params.device, data = req.body;
    req.getConnection(function(err, connection){
      connection.query(
      'UPDATE `devices` SET ? WHERE `id` = ?', [data, id], function(err) {
        if (err) {  return cb(err); }
        readDevice(id, cb);
      });
    });
  }
  // [END update]

  // [START delete]
  function _deleteDevice(req, cb) {
    var id = req.params.device;
    req.getConnection(function(err, connection){
      connection.query('DELETE FROM `devices` WHERE `id` = ?', id, cb);
    });
  }
  // [END delete]

  // [START Control]
  function controlDevice(req, cb) {
    var data = req.body;
    var myData = getDviceControlData(data);
    req.getConnection(function(err, connection){
      connection.query('SELECT id FROM `users_properties` WHERE user_id=? AND (room_id=? OR apartment_id=? OR device_id=?)',
      [myData.user_id, myData.room_id, myData.apartment_id, myData.id], function(err, res){
        if(err) {  return cb(err); }
        if(res.length > 0){
          connection.query('SELECT id FROM `devices` WHERE id=? AND secret_ky=?', [myData.id, myData.secret_ky], 
            function(err, res){
              if(err) {  return cb(err); }
              if(res.length > 0){
                connection.query('UPDATE `devices` SET online=?, on_off=?, hexcolor=?, dim_value=? WHERE id=?', 
                  [1, myData.on_off, myData.hexcolor, myData.dim_value, myData.id], function(err, res){
                    if(err) {  return cb(err); }
                    return cb(null, res[0]);
                  });
                  
                  readDevice(myData.id, cb);
              } else {
                var err = new Array();
                err.message = "Authintication failed!!";
                err.code = 401;
                return cb(err);
              }
            });
        }else {
          var err = new Array();
          err.message = "This user has no privilige over this/these device(s)";
          err.code = 401;
          return cb(err);
        }
      });
    });
  }
  // [END Control]
	return {
	    createSchema: createSchema,
      create: createDevice,
      read: readDevice,
      update: updateDevice,
      control: controlDevice,
      delete: _deleteDevice
  };

};

function getDeviceRequestData(data) {
  var newData = {};
  if("uid" in data) {
    newData['user_id'] = data['uid'];
  }
  if("hid" in data) {
    newData['apartment_id'] = data['hid'];
  }
  if("rid" in data) {
    newData['room_id'] = data['rid'];
  }
  if("dn" in data) {
    newData['name'] = data['dn'];
  }
  if("sk" in data) {
    newData['secret_ky'] = data['sk'];
  }
  return newData;
}

function getDviceControlData(data) {
  var newData = {};
  if("uid" in data)
    newData['user_id'] = data['uid'];
  if("rid" in data)
    newData['room_id'] = data['rid'];
  if("hid" in data)
    newData['apartment_id'] = data['hid'];
  if("did" in data)
    newData['id'] = data['did'];
  if("sk" in data)
    newData['secret_ky'] = data['sk'];
  if("onf" in data)
    newData['on_off'] = data['onf'];
  if("hxc" in data)
    newData['hexcolor'] = data['hxc'];
  if("dim" in data)
    newData['dim_value'] = data['dim'];
  return newData;
}

if (!module.parent) {
  var prompt = require('prompt');
  prompt.start();

  console.log(
    'Running this script directly will allow you to initialize your mysql ' +
    'database.\n This script will not modify any existing tables.\n');

  prompt.get(['host', 'user', 'password'], function(err, result) {
    if (err) { console.log('failed'); return; }
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