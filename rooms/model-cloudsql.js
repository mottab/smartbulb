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
  function createRoom(req, cb) {
    var data = req.body;
    var myData = getRoomRequestData(data);
    // room object contains, user_id, apartment_id, name(room name)
    req.getConnection(function(err, connection){
      connection.query('SELECT * FROM `users` WHERE id=?', myData.user_id, function(err, res){
      if(err) { return cb(err); }
      if(res.length > 0) {
        connection.query('SELECT * FROM `apartments` WHERE id=?', 
          myData.apartment_id, function(err, res){
            if(err) { return cb(err); }
            if(res.length > 0) {
              connection.query('INSERT INTO `rooms` SET name=?, apartment_id=?, secret_ky=?', 
                [myData.name, myData.apartment_id, myData.secret_ky], function(err, res){
                if (err) { return cb(err); }
                myData['room_id'] = res.insertId;
                connection.query('SELECT id FROM `users_properties` WHERE user_id=? AND apartment_id=?', 
                  [myData.user_id, myData.apartment_id], function(err, res){
                  if(err) { return cb(err); }
                  if(res.length == 0) {
                    connection.query('INSERT INTO `users_properties` SET user_id=?, room_id=?, is_admin=0', 
                      [myData.user_id, myData.room_id], function (err, res){
                        if(err) { return cb(err); }
                        return cb(null, res[0]);
                      });
                  }
                });
                
                req.params.room = myData.room_id;
                readRoom(req, cb);
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
  function readRoom(req, cb) {
    var id = req.params.room;
    req.getConnection(function(err, connection){
      connection.query(
      'SELECT * FROM `rooms` WHERE `id` = ?', id, function(err, results) {
        if (err) {  return cb(err); }
        if (!results.length) {
          
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
  function updateRoom(req, cb) {
    var id = req.params.room, data = req.body;
    req.getConnection(function(err, connection){
      connection.query(
      'UPDATE `rooms` SET ? WHERE `id` = ?', [data, id], function(err) {
        if (err) {  return cb(err); }
        
        read(id, cb);
      });
    });
  }
  // [END update]

  // [START delete]
  function _deleteRoom(req, cb) {
    var id = req.params.room;
    req.getConnection(function(err, connection){
      connection.query('DELETE FROM `rooms` WHERE `id` = ?', id, cb);
    });
  }
  // [END delete]

  // [START control]
  function controlRoom(req, cb) {
    var data = req.body;
    var myData = getRoomControlData(data);
    req.getConnection(function(err, connection){
      connection.query('SELECT id FROM `users_properties` WHERE user_id=? AND room_id=?',
      [myData.user_id, myData.room_id], function(err, res){
        if(err) {  return cb(err); }
        if(res.length > 0){
          connection.query('SELECT id FROM `rooms` WHERE secret_ky=?', myData.secret_ky, function(err, res){
            if(err) { return cb(err);}
            if(res.length > 0) {
              connection.query('SELECT id FROM `devices` WHERE room_id=?', myData.room_id, function(err, res){
            if(err) {  return cb(err); }
            if(res.length > 0){
                var ids = new Array();
                var qmarks = "";
                for (var i = 0; i < res.length; ++i) {
                  ids[i] = res[i]['id'];
                  qmarks += "?";
                  if(i != res.length-1) {
                      qmarks += ","
                  } 
                }
                // return cb(null, ids);
                connection.query('UPDATE `devices` SET online=?, on_off=?, hexcolor=?, dim_value=? WHERE id in ('+ids+')'
                    , [1, myData.on_off, myData.hexcolor, myData.dim_value],
                    function(err, res){ 
                      if(err) {  return cb(err); }
                      
                      return cb(null, res[0]);
                    }); 
            }else{
              var err = new Array();
              err.message = "No devices are found inside this room";
              err.code = 401;
              
              return cb(err);
            }
          });
        }else{
          var err = new Array();
          err.message = "This user has no privilige over this room";
          err.code = 401;
          
          return cb(err);
        }
      });
      } else {
        var err = new Array();
        err.message = "This user has no privilige over this room!!";
        err.code = 401;
        
        return cb(err);
      }
    });
    });
    
  }
  // [END control]

	return {
	    createSchema: createSchema,
      create: createRoom,
      read: readRoom,
      update: updateRoom,
      control: controlRoom,
      delete: _deleteRoom
  };

};

/**
  * This function is used to map create new user request data into
  * the real database coloums name
  * Inputs: data, hashmap for request body
  * Output: new hashmap of the new keys related to database
*/
function getRoomRequestData(data) {
  var newData = {};
  if("uid" in data) {
    newData['user_id'] = data['uid'];
  }
  if("hid" in data) {
    newData['apartment_id'] = data['hid'];
  }
  if("rn" in data) {
    newData['name'] = data['rn'];
  }
  if("sk" in data) {
    newData['secret_ky'] = data['sk'];
  }

  return newData;
}


function getRoomControlData(data) {
  var newData = {};
  if("uid" in data)
    newData['user_id'] = data['uid'];
  if("rid" in data)
    newData['room_id'] = data['rid'];
  if("hid" in data)
    newData['apartment_id'] = data['hid'];
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