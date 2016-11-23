// io.js

var io = require('socket.io')();


// Listen for new connections from clients (socket)
io.on('connection', function (socket) {

  socket.on('add-message', function (data) {
      io.emit('add-message', data);
    });

  socket.on('new-question', function (data){
    console.log('io.js log new question')
    // question = generateQuestion()
    io.emit('update-question', data)
  })

});

// io represents socket.io on the server - let's export it
module.exports = io;
