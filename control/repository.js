'use strict';

var q = require('q');

module.exports.addUser = addUser;
module.exports.removeUser = removeUser;
module.exports.getUser = getUser;
module.exports.isUserExist = isUserExist;

module.exports.addDevice = addDevice;
module.exports.removeDevice = removeDevice;
module.exports.getDevice = getDevice;
module.exports.isDeviceExist = isDeviceExist;

module.exports.getDeviceIdAndUserSocket = getDeviceIdAndUserSocket;

var tmpData = {deviceId: 0};

function addUser(user, client) {
	return q.Promise(function(resolve, reject, notify){
		client.hmset("u", user.userId, JSON.stringify(user), function(err, res){
			if(err === null) {
				resolve(res);
			} else {
				reject(err);
			}
		});
	});
};

function getUser(userId, client) {
	return q.Promise(function(resolve, reject, notify){
		client.hmget("u", userId, function(err, res){
			if(err === null){
				resolve(res);
			} else {
				reject(err);
			}
		});
	});
};

function removeUser(userId, client) {
	return q.Promise(function(resolve, reject, notify){
		client.hdel("u", userId, function(err, res){
			if(err === null) {
				resolve();
			} else {
				reject(err);
			}
		});
	});
};

function isUserExist(userId, client) {
	return q.Promise(function(resolve, reject, notify){
		client.HEXISTS("u", userId, function(err, res){
			if(err === null){
				resolve(res);
			} else {
				reject(err);
			}
		});
	});
}

function addDevice(device, client) {
	return q.Promise(function(resolve, reject, notify){
		client.hmset("d", device.deviceId, JSON.stringify(device), function(err, res){
			if(err === null){
				console.log('res here is : ' + res);
				resolve(res);
			} else {
				reject(err);
			}
		});
	});
};

function getDevice(deviceId, client) {
	return q.Promise(function(resolve, reject, notify){
		client.hmget("d", deviceId, function(err, res){
			if(err === null){
				resolve(res);
			} else {
				reject(err);
			}
		});
	});
};

function removeDevice(deviceId, client) {
	return q.Promise(function(resolve, reject, notify){
		client.hdel("d", deviceId, function(err, res){
			if(err === null){
				resolve();
			} else {
				reject(err);
			}
		});
	});
};

function isDeviceExist(deviceId, client) {
	return q.Promise(function(resolve, reject, notify){
		client.HEXISTS("d", deviceId, function(err, res){
			if(err === null){
				resolve(res);
			} else {
				reject(err);
			}
		});
	});
}

// Large scale queries :::::: using them is very heavy, never use them unless you really need

function getDeviceIdAndUserSocket(deviceId, client) {
	var toRet = {};
	return q.Promise(function(resolve, reject, notify){
		console.log('00000');
		toRet.deviceId = deviceId;
		console.log('11111');
		client.hmget("d", deviceId, function(err, res){
			if(err === null){
				client.hmget("u", JSON.parse(res).userId, function(err, res){
					if(err === null) {
						console.log(toRet.deviceId);
						toRet.userSocket = JSON.parse(res).socketId;
						resolve(toRet);
					} else {
						// console.log('Error Second');
						reject(err);
					}
				});
			} else {
				// console.log('Error First');
				reject(err);
			}
		});
	});
}









