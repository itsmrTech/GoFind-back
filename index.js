require('shery-logger');
var server =require( 'http');
var app=server.createServer((req,res)=>{});
app.listen(5000);
var io =require( "socket.io")(app);

io.on("connection",(socket)=>{
    console.log("SOCKET CONNECTED >",socket.id)
    socket.on("location",(coords)=>{
        console.log("COORDS > ",coords)
        socket.broadcast.emit("location",coords);
    })
})