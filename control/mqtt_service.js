'use strict';

var mosca = require('mosca')

module.exports = startMQTT;

function startMQTT(){

	var ascoltatore = {
	  type: 'redis',
	  redis: require('redis'),
	  db: 0,
	  port: 13875,
	  return_buffers: true, // to handle binary payloads
	  host: "pub-redis-13875.us-east-1-3.6.ec2.redislabs.com",
	  password: '123456789'
	};

	var moscaSettings = {
	  port: 1883,
	  backend: ascoltatore,
	  persistence: {
	    factory: mosca.persistence.Redis,
	    host: 'pub-redis-13875.us-east-1-3.6.ec2.redislabs.com',
	  	port: '13875',
	  	password: '123456789'
	  }
	};

	var server = new mosca.Server(moscaSettings);

	server.on('ready', function setup() {
	  console.log('Mosca server is up and running')
	});

	server.on('clientConnected', function(client) {
	    console.log('client connected', client.id);     
	});

	server.on('clientDisconnecting', function(client) {
	    console.log('client disconnecting', client.id);
	});

	server.on('clientDisconnected', function(client) {
	    console.log('client disconnected', client.id);
	});
	
	// fired when a message is received
	server.on('published', function(packet, client) {
	  console.log('Published', packet.payload.toString(), ', topic: ' , packet.payload.toString());
	});

	server.on('delivered', function(packet, client) {
	  console.log('delivered', packet.payload.toString());
	});

	// when a new client subscribes to a topic
	server.on('subscribed', function(topic, client) {
	  console.log('subscribed', topic);
	});

	server.on('unsubscribed', function(topic, client) {
	  console.log('unsubscribed', topic);
	});

}