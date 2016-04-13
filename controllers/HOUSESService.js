'use strict';

exports.housesHOUSEIDDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * hOUSEID (BigDecimal)
  * xBulbApiKey (String)
  **/
  // no response value expected for this operation
  
  
  res.end();
}

exports.housesHOUSEIDGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * hOUSEID (BigDecimal)
  * xBulbApiKey (String)
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

exports.housesHOUSEIDPUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * hOUSEID (BigDecimal)
  * xBulbApiKey (String)
  * house object (HouseObject)
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

exports.housesPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * xBulbApiKey (String)
  * house object (HouseObject)
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

