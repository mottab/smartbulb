// Copyright 2015, Ibtikar Technologies, Inc.

'use strict';

var path = require('path'),
config = require('./config'),
express = require('express'),
mysql = require('mysql'),
myConnection = require('express-myconnection'),
jsyaml = require('js-yaml'),
fs = require('fs'),
app = express(),
swaggerTools = require('swagger-tools'),
https = require('https'),
pem = require('pem'),
socketio = require('./control/socket'),
request = require('request'),
mqtt_server = require('./control/mqtt_service'),
redisClient = require('redis').createClient(config.redis_config.REDISURL,
{
  no_ready_check: true,
  enable_offline_queue: false
}),

dbOptions = config.dpOptions;
// var options = {
//    key  : fs.readFileSync('server.key'),
//    cert : fs.readFileSync('server.cert')
// };
pem.config({
    pathOpenSSL: '/usr/bin/openssl'
});
pem.createCertificate({days:365, selfSigned:true}, function(err, keys){

    // //  DB connection - Signleton
    app.use(myConnection(mysql, dbOptions, 'pool'));
    // // Setting the app environment "development", "production"
    process.env.NODE_ENV = 'development';
    // ***************************************************************

    console.log("Node Env Variable: " + process.env.NODE_ENV);
    // swaggerRouter configuration
    var options = {
      swaggerUi: '/swagger.json',
      controllers: './controllers',
      ignoreMissingHandlers: true,
      useStubs: process.env.NODE_ENV === config.env ? true : false // Conditionally turn on stubs (mock mode)
    };
    // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
    // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
    var spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
    var swaggerDoc = jsyaml.safeLoad(spec);

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
      // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
      app.use(middleware.swaggerMetadata());

      // Validate Swagger requests
      app.use(middleware.swaggerValidator());

      // Route validated requests to appropriate controller
      app.use(middleware.swaggerRouter(options));

      // Serve the Swagger documents and Swagger UI
      app.use(middleware.swaggerUi());

      // Start the server
      // http.createServer(app).listen(serverPort, function () {
      //   console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
      //   console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
      // });
    });
    // ***************************************************************

    //devices
    var devices_model = require('./devices/model-' + config.dataBackend)(config);
    app.use('/api/devices', require('./devices/api')(devices_model));

    //users
    var users_model = require('./users/model-' + config.dataBackend)(config);
    app.use('/api/users', require('./users/api')(users_model));

    //Houses
    var aparts_model = require('./houses/model-' + config.dataBackend)(config);
    app.use('/api/houses', require('./houses/api')(aparts_model));

    //Rooms
    var rooms_model = require('./rooms/model-' + config.dataBackend)(config);
    app.use('/api/rooms', require('./rooms/api')(rooms_model));

    // Redirect root to /bulb sytem root dir
    app.get('/', function(req, res) {
      if(req.headers['x-bulb-api-key'] === config.API_KEY.hash){
        res.status(200).json({message:'Welcom to ibtikar smart bulb backend system, ' + 
          'This system has no user interface'});
      } else {
        res.status(404).json({message:'Not Authorized', code:404});
      }
    });

    // ****************************Accessing Sockets-ip************************************
    // [START external_ip]
    // In order to use websockets on App Engine, you need to connect directly to
    // application instance using the instance's public external IP. This IP can
    // be obtained from the metadata server.
    var METADATA_NETWORK_INTERFACE_URL = 'http://metadata/computeMetadata/v1/' +
    '/instance/network-interfaces/0/access-configs/0/external-ip';

    function getExternalIp(cb) {
      var options = {
        url: METADATA_NETWORK_INTERFACE_URL,
        headers: {
          'Metadata-Flavor': 'Google'
        }
      };

      request(options, function(err, resp, body){
        if(err || resp.statusCode !== 200) {
          console.log('Error while talking to metadata server, assuming localhost');
          return cb('localhost');
        }
        return cb(body);
      });
    }
    // [END external_ip]

    app.get('/getsocketip', function(req, res) {
      if(req.headers['x-bulb-api-key'] === config.API_KEY.hash){
        getExternalIp(function(externalIp){
          // send it back
          res.status(200).json({ip: externalIp});
        });
      } else {
        res.status(404).json({message:'Not Authorized', code:404});
      }
    });
    // ************************************************************************************

    // Basic error handler
    app.use(function(err, req, res, next) {
      /* jshint unused:false */
      console.error(err.stack);
      res.status(500).send('Something broke! Please contact technical support');
    });

//     server = https.createServer({key: keys.serviceKey, cert: keys.certificate}, app),
// socketServer = https.Server({key: keys.serviceKey, cert: keys.certificate}, app),
    // Start the server
    var server = https.createServer({key: keys.serviceKey, cert: keys.certificate}, app).listen(config.port, function () {
      var host = server.address().address;
      var port = server.address().port;

      console.log('App listening at http://%s:%s', host, port);
    });

    // ***************************************** SOCKETS START **********************************************
    // setup socket
    // var socketServer = https.Server({key: keys.serviceKey, cert: keys.certificate}, app).listen(config.io_port, function(){
    //   console.log('socketIO is listening on *:' + config.io_port);
    // });
    // socketio(socketServer, redisClient);
    // ***************************************** SOCKETS END ***********************************************
    // ***************************************** MQTT START ************************************************
    mqtt_server();
    // startMQTT();
    // ***************************************** MQTT END **************************************************

});