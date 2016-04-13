'use strict';

exports.devicesDEVICEIDDELETE = function(args, res, next) {
  /**
   * parameters expected in the args:
  * dEVICEID (BigDecimal)
  * xBulbApiKey (String)
  **/
  // no response value expected for this operation
  
  
  res.end();
}

exports.devicesDEVICEIDGET = function(args, res, next) {
  /**
   * parameters expected in the args:
  * dEVICEID (BigDecimal)
  * xBulbApiKey (String)
  **/
  
  
  var examples = {};
  examples['application/json'] = {
  "room_id" : 1.3579000000000001069366817318950779736042022705078125,
  "hexcolor" : "aeiou",
  "secret_ky" : "aeiou",
  "name" : "aeiou",
  "online" : 1.3579000000000001069366817318950779736042022705078125,
  "created_at" : "aeiou",
  "id" : 1.3579000000000001069366817318950779736042022705078125,
  "on_off" : 1.3579000000000001069366817318950779736042022705078125,
  "dim_value" : 1.3579000000000001069366817318950779736042022705078125,
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

exports.devicesDEVICEIDPUT = function(args, res, next) {
  /**
   * parameters expected in the args:
  * dEVICEID (BigDecimal)
  * xBulbApiKey (String)
  * room object (DeviceObject)
  **/
  
  
  var examples = {};
  examples['application/json'] = {
  "room_id" : 1.3579000000000001069366817318950779736042022705078125,
  "hexcolor" : "aeiou",
  "secret_ky" : "aeiou",
  "name" : "aeiou",
  "online" : 1.3579000000000001069366817318950779736042022705078125,
  "created_at" : "aeiou",
  "id" : 1.3579000000000001069366817318950779736042022705078125,
  "on_off" : 1.3579000000000001069366817318950779736042022705078125,
  "dim_value" : 1.3579000000000001069366817318950779736042022705078125,
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

exports.devicesPOST = function(args, res, next) {
  /**
   * parameters expected in the args:
  * xBulbApiKey (String)
  * device object (DeviceObject)
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

