// Copyright 2015, Ibtkar Technologies, Inc.


'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var config = require('../config');

module.exports = function(model) {

	var router = express.Router();
	router.use(bodyParser.json());

	function handleRpcError(err, res) {
    	if (err.code === 404) { return res.status(404).json({message: err.message, internalCode: err.code}); }
    	res.status(500).json({
      		message: err.message,
      		internalCode: err.code
   	 	});
    }

    router.get('/', function list(req, res) {
      if(req.headers['x-bulb-api-key'] === config.API_KEY.hash){
        res.status(200).json({
              message: 'Welcom to ibtikar smart bulb USERS backend system, ' + 
                  'This system has no user interface'
                });
      } else {
        return handleRpcError({
          code: 404,
          message: 'Not Authorized'
        }, res);
      }
  	});

    router.post('/', function insert(req, res) {
      if(req.headers['x-bulb-api-key'] === config.API_KEY.hash){
        model.create(req, function(err, entity) {
          if (err) { return  handleRpcError(err, res);}
          res.json(entity);
        });
      } else {
        return handleRpcError({
          code: 404,
          message: 'Not Authorized'
        }, res);
      }
  	});

  	router.get('/:user(\\d+)', function get(req, res) {
      if(req.headers['x-bulb-api-key'] === config.API_KEY.hash){
        model.read(req, function(err, entity) {
          if (err) { return handleRpcError(err, res); }
          res.json(entity);
        });
      } else {
        return handleRpcError({
          code: 404,
          message: 'Not Authorized'
        }, res);
      }
  	});

  	router.put('/:user(\\d+)', function update(req, res) {
      if(req.headers['x-bulb-api-key'] === config.API_KEY.hash){
        model.update(req, function(err, entity) {
          if (err) { return handleRpcError(err, res); }
          res.json(entity);
        });
      } else {
        return handleRpcError({
          code: 404,
          message: 'Not Authorized'
        }, res);
      }
  	});

    router.delete('/:user(\\d+)', function _delete(req, res) {
      if(req.headers['x-bulb-api-key'] === config.API_KEY.hash){
        model.delete(req, function(err, entity) {
          if (err) { return handleRpcError(err, res); }
          res.json(entity);
        });
      } else {
        return handleRpcError({
          code: 404,
          message: 'Not Authorized'
        }, res);
      }
    });

    return router;
};