/*
WebChat - a node.js web chat
Copyright (C) 2015  Jens Wirth <jewirth@gmail.com>

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
,   io = require('socket.io').listen(server)
,   fs = require('fs');

server.listen(80);

var history;

try {
    history = JSON.parse(fs.readFileSync('last_100_messages', 'utf8'));
} catch (error) {
    history = [];
}

function addToHistory(msg) {
  msg.isHistory = true;
  history.push(msg);
  if (history.length > 100) {
    history = history.slice(1);
  }
  fs.writeFileSync("last_100_messages", JSON.stringify(history), 'utf-8');
}

app.use(express.static(__dirname + '/'));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.sockets.on('connection', (socket) => {
  for (i=0; i<history.length; i++) {
    socket.emit('chat', history[i]);
  }
  socket.on('chat', (msg) => {
    if (msg.text.length > 0) {
        var tosend = { zeit: new Date(), name: msg.name || 'Anonym', text: msg.text };
        io.sockets.emit('chat', tosend);
        addToHistory(tosend);
    }
  });
});

//eof
