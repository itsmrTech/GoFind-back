require('shery-logger');
var server = require('http');
var app = server.createServer((req, res) => {});
app.listen(5000);
var io = require("socket.io")(app);
var iphone = {
    lat: 36.4620281,
    long: 52.8310413,
}
function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  var step={
      lat:0.000002,
      long:0.000002
  }
var changeStep=()=>{
    
    lat=rand(-0.000009,0.000009);
    long=rand(-0.000009,0.000009);
    console.log("distance > ",{lat,long})
    
    setTimeout(changeStep,rand(10000,90000));

}
var goForward=()=>{
    iphone.lat+=lat;
    iphone.long+=long;
    console.log("traveling to >",iphone)    
    io.emit("location",iphone);
    setTimeout(goForward,rand(100,500));    
}
io.on("connection", (socket) => {
    console.log("SOCKET CONNECTED >", socket.id);
    
    changeStep();
    goForward();
    socket.on("location-user", (coords) => {
        console.log("COORDS > ", coords)
        socket.broadcast.emit("location-user", coords);
    })
})