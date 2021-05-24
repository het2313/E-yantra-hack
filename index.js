require('dotenv').config();
const Express = require('express')();
const Http = require('http').Server(Express);
const Socketio = require('socket.io')(Http, {
	cors: {
		origin: '*',
	},
});
var markers = [];

Socketio.on('connection', (socket) => {
	socket.emit('marker', markers);
	socket.on('marker', (data) => {
		markers.push({ name: data.name, noPlate: data.noPlate, id: data.id, loc: data.loc });
		Socketio.emit('marker', markers);
	});
});
Http.listen(process.env.PORT || 5000, () => {
	console.log('Listening at :5000...');
});
