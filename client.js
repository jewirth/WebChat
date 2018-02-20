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

var window_focus = true;
var unread = 0;

$(window).focus(function() {
    window_focus = true;
	unread = 0;
	document.title = 'chat';
}).blur(function() {
    window_focus = false;
});

$(document).ready(function(){
	$('#content').append($('<li></li>').append(
       	$('<span>').text('Welcome to http://foo.snej.de'),
	));
	$('#content').append($('<li></li>').append(
    	$('<p>').text(' '),
	));

	var socket = io.connect();
	socket.on('chat', function (data) {
	    var zeit = new Date(data.zeit);
		if (!window_focus) {
			unread++;
			document.title = 'chat (' + unread + ')';
		}
	    $('#content').append(
	        $('<li></li>').append(
	            $('<span>').text('[' + zeit.getHours() + ':' +
                 (zeit.getMinutes()<10?+'0':'') + zeit.getMinutes() + ':' +
                 (zeit.getSeconds()<10?+'0':'') + zeit.getSeconds() + '] '),
	            $('<b>').text(typeof(data.name) != 'undefined' ? data.name + ': ' : ''),
	            $('<span>').text(data.text))
	    );
		window.scrollTo(0,document.body.scrollHeight);
	});

	function senden(){
		var name = $('#name').val();
		var text = $('#text').val();
		socket.emit('chat', { name: name, text: text });
		$('#text').val('');
	}

	$('#senden').click(senden);
	$('#text').keypress(function (e) {
		if (e.which == 13) {
			senden();
		}
	});
});
