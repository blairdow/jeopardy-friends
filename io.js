// io.js

var io = require('socket.io')();
var questionLoad = require('./config/question')

// Listen for new connections from clients (socket)
io.on('connection', function (socket) {

    socket.on('new-question', function (data){
      io.emit('update-question', data)
    })

  socket.on('add-message', function (data) {
      io.emit('add-message', data);
    });


});

// io represents socket.io on the server - let's export it
module.exports = io;
