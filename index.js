var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var PORT = process.env.PORT || 3000;

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket)=>{
    console.log('a user connected');

    socket.on('chat message', (msg)=>{
        io.emit('chat message', msg);
    });

    socket.on('disconnect', ()=>{
        console.log('the user disconnected');
    });
});

http.listen(PORT, ()=>{
    console.log(`it is live on ${PORT}`);
})