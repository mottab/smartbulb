// Copyright 2015, Ibtikar Technolgies

'use strict';

module.exports = {
	env: 'development',
	// redis db configuration
	redis_config: {
		REDISURL: 'redis://ib-g-bulb:123456789@pub-redis-13875.us-east-1-3.6.ec2.redislabs.com:13875',
		PORT: '13875',
		PASSWORD: '123456789'
	},
	// configuring the port to 8080 or
	// environment default port if not the same
	port: process.env.PORT || 443,
	io_port: 3000,
	// setting backend cloud storage db (cloudsql, mongodb, datastore)
	dataBackend: 'cloudsql',

	// Setting project id over gcloud
	gcloud: {
		projectId: 'ibtikar-s-bulb'
	},

	// mysql configuration, if I am working over cloudsql
	mysql: {
		user: 'MostafaKhattab',
		password: 'ibtikar_bulb@2016',
		host: '173.194.233.155'
	},

	// express-myconnections database options
	dpOptions: {
	  host: '173.194.233.155',
      user: 'MostafaKhattab',
      password: 'ibtikar_bulb@2016',
      port: 3306,
      database: 'ibtikar_bulb'
	},

	// securing the API
	API_KEY: {
		base: 'ibtikar+glinty+smart+bulb',
		hash: '5932e7543873bbfa2d19c32649092c73d0bdcb1f'
	}

};
