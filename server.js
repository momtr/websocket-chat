var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

// the users lookup object
let users = {};

// all messages
let messages = [];

// static folder
app.use(express.static('static'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});


io.on('connection', function(socket) {
  users[socket.id] = true;

  socket.emit('start_messages', messages);

  console.log(users);

  socket.on('message', function(message) {
  	if(message.type === 'message') {
  		message.id = socket.id;
  		messages.push(message);
  		// broadcast message
  		io.emit('message', message);
  		console.log(messages);
  	}
  });

  // if the user disconnects
  socket.on('disconnecting', () => {
  	users[socket.id] = false;
  });
});

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});