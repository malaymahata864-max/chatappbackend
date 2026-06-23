const Server = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'*'
    }
});
const userSockets = {};
const getSocketByUserId = (userId) => {
    return userSockets[userId];
}
io.on('connection', (socket) => {
   const userId = socket.handshake.query.userId;
    if(userId)userSockets[userId] = socket.id;
    io.emit('getOnlineUsers', Object.keys(userSockets));
    socket.on('disconnect', () => {
       
        delete userSockets[userId];
        io.emit('getOnlineUsers', Object.keys(userSockets));
    });
});
module.exports = { io, getSocketByUserId, server,app };
