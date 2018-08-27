var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usersOnline = 0;
let currentUsers = [];

var PORT = process.env.PORT || 3000;

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

const usersConnected = (num)=>{
    usersOnline += num;
}

io.on('connection', (socket)=>{
    console.log('a user connected');
    usersConnected(1);   
    io.emit('user connected', usersOnline);
    io.emit('users online', usersOnline);

    socket.on('user name given', (username)=>{
        currentUsers.push(username);
        io.emit('user name list', currentUsers);
    })

    socket.on('chat message', (msg)=>{
        console.log("a user sent a messsage");
        io.emit('chat message', msg);
    });

    socket.on('disconnect', ()=>{
        console.log('the user disconnected');
        usersConnected(-1); 
        io.emit('users online', usersOnline);
        io.emit('user name list', currentUsers);
    });
});

http.listen(PORT, ()=>{
    console.log(`it is live on ${PORT}`);
})