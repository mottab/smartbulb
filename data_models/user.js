// Copyright 2015, Ibtkar Technologies, Inc.


'use strict';

var User = function () {
	this.data = {
		id = null,
		email = null,
		username = null,
		password = null,
		birth_date = null,
		latitude = null,
		longitude = null
	};

	this.fill = function(info) {
		for(var prop in this.data) {
			if(this.data[prop] !== 'undefined') {
				this.data[prop] = info[prop];
			}
		}
		
		this.getID = function() {
			return this.data.id;
		};

		this.getEmail = function() {
			return this.data.email;
		};

		this.getUsername = function() {
			return this.data.username;
		};

		this.getPassword = function() {
			return this.data.password;
		};

		this.getBirthDate = function() {
			return this.data.birth_date;
		};

		this.getLongitude = function() {
			return this.data.longitude;
		};

		this.getLatitude = function() {
			return this.data.latitude;
		};

		this.getUser = function() {
			return this.data;
		};

		this.mapToDatabase = function() {
			this.dbData = {

			}
		};
	};
};

module.exports = function(info) {
	var instance = new User();
	instance.fill(info);
	return instance;
}