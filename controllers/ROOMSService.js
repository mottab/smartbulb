'use strict';

exports.roomsPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * xBulbApiKey (String)
  * room object (RoomObject)
  **/
  
  
  var examples = {};
  examples['application/json'] = {
  "secret_ky" : "aeiou",
  "name" : "aeiou",
  "created_at" : "aeiou",
  "id" : 1.3579000000000001069366817318950779736042022705078125,
  "modified_at" : "aeiou"
};
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}

exports.roomsROOMIDDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * rOOMID (BigDecimal)
  * xBulbApiKey (String)
  **/
  // no response value expected for this operation
  
  
  res.end();
}

exports.roomsROOMIDGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * rOOMID (BigDecimal)
  * xBulbApiKey (String)
  **/
  
  
  var examples = {};
  examples['application/json'] = {
  "apartment_id" : 1.3579000000000001069366817318950779736042022705078125,
  "secret_ky" : "aeiou",
  "name" : "aeiou",
  "created_at" : "aeiou",
  "id" : 1.3579000000000001069366817318950779736042022705078125,
  "modified_at" : "aeiou"
};
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}

exports.roomsROOMIDPUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * rOOMID (BigDecimal)
  * xBulbApiKey (String)
  * room object (RoomObject)
  **/
  
  
  var examples = {};
  examples['application/json'] = {
  "apartment_id" : 1.3579000000000001069366817318950779736042022705078125,
  "secret_ky" : "aeiou",
  "name" : "aeiou",
  "created_at" : "aeiou",
  "id" : 1.3579000000000001069366817318950779736042022705078125,
  "modified_at" : "aeiou"
};
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}

