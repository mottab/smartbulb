'use strict';

var socketio = require('socket.io'),
    repo = require('./repository'),
    User = require('./User'),
    Device = require('./Device');

module.exports = initSockets;

function initSockets(socketServer, redisClient) {
    var io = socketio.listen(socketServer);
    var data, user, device;
    var users = io.of('/users').on('connection', function(socket) {
        function serverError(err, message) {
            console.log(err);
            socket.emit('serverError', {
                error: err,
                message: message
            });
        };
        // nu ==> new user
        socket.on('nu', function(j_data, ack) {
            // data contains a "user object" of type "socket user"
            data = JSON.parse(j_data);
            user = new User(data.userId, data.secretHash, data.deviceId, socket.id);
            // add user to redis-db Hash
            repo.addUser(user, redisClient)
                .done(function(res) {
                    // if I need to join a user, do it here
                    // any initialization should be added here
                    console.log(res);
                    ack();
                }, function(err) {
                    serverError(err, 'Something went wrong when adding user!');
                });
        });
        // cd ==> control device
        socket.on('cd', function(j_data, j_device, ack) {
            // data contains a "user object"
            data = JSON.parse(j_data);
            user = new User(data.userId, data.secretHash, data.deviceId, socket.id);
            // device contains a "device object"
            data = JSON.parse(j_device);
            device = new Device(data.deviceId, data.userId, socket.id, data.online, data.on_off, data.hex, data.dim);
            // get the device's socket_id and emit a change event to it.
            // for example:
            // io.of('/devices').to(socks['u'].id).emit('test2_fired');
            repo.isDeviceExist(user.deviceId, redisClient)
                .done(function(res) {
                    console.log('server controlling device : ' + res);
                    if (res == 1) {
                        // device found .. control it
                        // before control, get its socket from redis-db
                        repo.getDevice(user.deviceId, redisClient)
                            .done(function(res) {
                                // got device data inside res var.
                                // emit to device --> socket event is 
                                // dc => device change
                                data = JSON.parse(res);
                                device.socketId = data.socketId;
                                device.deviceId = data.deviceId;
                                repo.addDevice(device, redisClient)
                                    .done(function(res){
                                        console.log('emitting to device' + device.deviceId);
                                        io.of('/devices').to(device.socketId).emit('dc', device);
                                    }, function(err){
                                        serverError(err, 'Something went wrong when controlling device !');
                                    });
                            }, function(err) {
                                serverError(err, 'Something went wrong when controlling device !');
                            });
                    }
                    ack();
                }, function(err) {
                    serverError(err, 'Something went wrong when controlling device !');
                });
        });
        // disconnect
        socket.on('disconnect', function(data) {
            if (user !== undefined) {
                // remove from redis-db Hash
                repo.removeUser(socket.id, redisClient)
                    .done(function() {
                        //user removed from db -- done
                        console.log('user removed because of disconnection');
                    }, function(err) {
                        serverError(err, 'Something went wrong when disconnecting User!');
                    });
            }
            user = null;
        });
    });
    var devices = io.of('/devices').on('connection', function(socket) {
        function serverError(err, message) {
            console.log(err);
            socket.emit('serverError', {
                error: err,
                message: message
            });
        };
        // nd ==> new device
        socket.on('nd', function(j_data, ack) {
            // data contains a device object
            data = JSON.parse(j_data);
            device = new Device(data.deviceId, data.userId, socket.id, data.online, data.on_off, data.hex, data.dim);
            // load device info from mysql-db instead.
            // then add to redis-db
            repo.addDevice(device, redisClient)
                .done(function(res) {
                    // device added.
                    repo.getUser(device.userId, redisClient)
                        .done(function(res) {
                            // res var contains the user if found
                            console.log('res for new device is : ' + res);
                            if (res !== null && res !== 0 && res !== undefined) {
                                // notify user
                                // ad ==> active device
                                var userSocketID = JSON.parse(res).socketId;
                                var userDeviceID = JSON.parse(res).deviceId;
                                console.log('sending event to user that device is connected with sockid: '+userSocketID);
                                // io.sockets.connected[userSocketID].emit('ad', userDeviceID);
                                io.of('/users').to(userSocketID).emit('ad', userDeviceID);
                            }
                            ack(); // 1 ==> means that its added successflly
                        }, function(err) {
                            serverError(err, 'Something went wrong when notifying User!');
                        });
                }, function(err) {
                    serverError(err, 'Something went wrong when adding Device!');
                });
            // inform user that the device is online - (if user is already online)

        });
        // disconnect -- norify the user of the disconnect
        socket.on('disconnect', function(data) {
            if (device !== undefined) {
                console.log('before send: ' + device.deviceId);
                repo.getDeviceIdAndUserSocket(device.deviceId, redisClient)
                    .done(function(res){
                        // res var contains the user if found
                        if (res !== null && res !== 0 && res !== undefined) {
                            // notify user
                            // dd ==> device disconnected
                            var userSocketID = res.userSocket;
                            console.log('res are : ' +res);
                            io.of('/users').to(userSocketID).emit('dd', res.deviceId);
                            console.log('device ' + res.deviceId + ' is removed because of disconnection, reported to user');
                        }
                        repo.removeDevice(res.deviceId, redisClient)
                            .done(function(){
                                console.log('device is deteled successfully from redis-db');
                            }, function(err){
                                serverError(err, 'Something went wrong when deleting Device!');
                            });
                    }, function(err){
                        serverError(err, 'Something went wrong when acknowleding user about Device disconnection!');
                    });
            }
            device = null;
        });
    });
};