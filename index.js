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
        console.log("A user sent a messsage");
        io.emit('chat message', msg);
    });

    socket.on('disconnect', ()=>{
        console.log('A user disconnected');
        usersConnected(-1); 
        io.emit('disconnect')
        io.emit('check users');
    });

    socket.on('recheck client', (user)=>{
        console.log("rechecking that ", user, " is still there");
        currentUsers = [];
        currentUsers.push(user);
        setTimeout(()=>{ 
            io.emit('user name list', currentUsers);
            io.emit('users online', usersOnline);
        }, 1000);
    })
});

http.listen(PORT, ()=>{
    console.log(`it is live on ${PORT}`);
})