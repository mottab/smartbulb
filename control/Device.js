'use strict';

module.exports = function Device(deviceId, userId, socketId, online, on_off, hex, dim){
	this.userId = userId;
	this.deviceId = deviceId;
	this.socketId = socketId;
	this.online = online;
	this.on_off = on_off;
	this.hex = hex;
	this.dim = dim;
};