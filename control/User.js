'use strict';

module.exports = function User(userId, secretHash,deviceId, socketId){
	this.userId = userId;
	this.deviceId = deviceId;
	this.socketId = socketId;
	this.secretHash = secretHash;
};