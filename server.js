let express = require("express");
let app = express();

app.use('/', express.static('public') );

//http server ON the express app
let http = require("http");
let server = http.createServer(app);



//sockets on top of the http server
let io = require("socket.io");
io = new io.Server(server);

//variable for publicNameSpace
let publicSockets = io.of('/publicSpace');

//for publicSockets
publicSockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);
    
    socket.on('data', (data)=>{
        //console.log(data);
        publicSockets.emit('sdata',data);
    })

    socket.on('cleanData',(data)=>{
        publicSockets.emit('scleanData',data);
       // console.log(data);
    })

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });

});

//variable for publicNameSpace
let privateSockets = io.of('/privateSpace');

//for publicSockets
privateSockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);
    
    socket.on("roomJoin", (data)=>{
        socket.roomName = data.name;
        socket.join(socket.roomName);
    })

    socket.on('data', (data)=>{

        //privateSockets.emit('sdata',data);
        privateSockets.to(socket.roomName).emit('sdata' , data);
    })

    socket.on('cleanData',(data)=>{
        //privateSockets.emit('scleanData',data);
        privateSockets.to(socket.roomName).emit('scleandata' , data);
    })

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
    });

});


server.listen( 3000 , ()=> {
    console.log('listening');
});