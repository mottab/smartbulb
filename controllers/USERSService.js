'use strict';

exports.usersPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * xBulbApiKey (String)
  * user object (UserObject)
  **/
  
  
  var examples = {};
  examples['application/json'] = {
  "password" : "aeiou",
  "birth_date" : "aeiou",
  "latitude" : 1.3579000000000001069366817318950779736042022705078125,
  "created_at" : "aeiou",
  "id" : 1.3579000000000001069366817318950779736042022705078125,
  "modified_at" : "aeiou",
  "email" : "aeiou",
  "username" : "aeiou",
  "longitude" : 1.3579000000000001069366817318950779736042022705078125
};
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}

exports.usersUSERIDDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * uSERID (BigDecimal)
  * xBulbApiKey (String)
  **/
  // no response value expected for this operation
  
  
  res.end();
}

exports.usersUSERIDGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * uSERID (BigDecimal)
  * xBulbApiKey (String)
  **/
  
  
  var examples = {};
  examples['application/json'] = {
  "password" : "aeiou",
  "birth_date" : "aeiou",
  "latitude" : 1.3579000000000001069366817318950779736042022705078125,
  "created_at" : "aeiou",
  "id" : 1.3579000000000001069366817318950779736042022705078125,
  "modified_at" : "aeiou",
  "email" : "aeiou",
  "username" : "aeiou",
  "longitude" : 1.3579000000000001069366817318950779736042022705078125
};
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}

exports.usersUSERIDPUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * uSERID (BigDecimal)
  * xBulbApiKey (String)
  * user object (UserObject)
  **/
  
  
  var examples = {};
  examples['application/json'] = {
  "password" : "aeiou",
  "birth_date" : "aeiou",
  "latitude" : 1.3579000000000001069366817318950779736042022705078125,
  "created_at" : "aeiou",
  "id" : 1.3579000000000001069366817318950779736042022705078125,
  "modified_at" : "aeiou",
  "email" : "aeiou",
  "username" : "aeiou",
  "longitude" : 1.3579000000000001069366817318950779736042022705078125
};
  
  if(Object.keys(examples).length > 0) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(examples[Object.keys(examples)[0]] || {}, null, 2));
  }
  else {
    res.end();
  }
  
  
}

