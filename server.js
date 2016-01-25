/*
WebChat - a node.js web chat
Copyright (C) 2016  Jens Wirth <jewirth@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var express = require('express')
,   app = express()
,   server = require('http').createServer(app)
,   io = require('socket.io').listen(server);

var history = [];

function addToHistory(msg) {
  history.push(msg);
  if (history.length > 100) {
    history = history.slice(1);
  }
}

server.listen(3001);

app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
	console.log("incomming GET /");
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
  socket.emit('chat', { zeit: new Date(), text: 'You are online!!' });
  for (i=0; i<history.length; i++) {
    socket.emit('chat', history[i]);
  }
  socket.on('chat', function (msg) {
    var tosend = { zeit: new Date(), name: msg.name || 'Anonym', text: msg.text };
    io.sockets.emit('chat', tosend);
    addToHistory(tosend);
  });
});

//eof
