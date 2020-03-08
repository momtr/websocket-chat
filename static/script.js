var socket; 
let messages = [];

$(function () {

    socket = io();

    socket.on('message', function(message) {
    	messages.push(message);
    	displayAllElements();
    });

    socket.on('start_messages', function(message) {
    	console.log(message);
    	messages = message;
    	displayAllElements();
    })

    $('#send-button').click(send);

    $(document).keypress(function(event){	
		var keycode = (event.keyCode ? event.keyCode : event.which);
		if(keycode == '13'){
			send();
		}
	});

	function send() {
		// send the things to the web socket
    	if($('#input').val().length > 0)
    		socket.emit('message', {
    			type: 'message',
    			text: $('#input').val()
    		});
    	clearTextField();
	}

	function clearTextField() {
		$('#input').val('');
	}

	function displayAllElements() {
		$('main').html("");
		for(let i of messages) {
			if(i.type === 'message') {
				// check if it is you own message
				if(i.id === socket.id) {
					$('main').append('<div class="chat-container"><div class="white-space"></div><div class="chat-you"><div class="id">' + i.id + '</div>' + i.text + '</div></div>');
				} else {
					$('main').append('<div class="chat-container"><div class="chat-others"><div class="id">' + i.id + '</div>' + i.text + '</div><div class="white-space"></div></div>');
				}
			}
		}
	}

 });
