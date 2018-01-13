require('shery-logger');
var server = require('http');
var app = server.createServer((req, res) => {});
app.listen(5000);
var io = require("socket.io")(app);
var iphone = {
    lat: 36.4620281,
    long: 52.8310413,
    delta:0.0055
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
var time=rand(100,500);
console.log(time);
var backward=false;

var goForward=()=>{
    iphone.lat+=lat;
    iphone.long+=long;
    console.log(lat/0.000009,(time-100)/400)
    // iphone.delta=((time-100)/400)/100;
    if(backward==false)
    {
        if(iphone.delta<0.0059) iphone.delta+=0.00003;
        else backward=true;
    }
    else{
        if(iphone.delta>0.005) iphone.delta-=0.00003;
        else backward=false;
    }
     
    console.log("traveling to >",iphone)    
    io.emit("location",iphone);
    setTimeout(goForward,time); 
    time=rand(100,500);   
}
// changeStep();

// goForward();
io.on("connection", (socket) => {
    console.log("SOCKET CONNECTED >", socket.id);
    
    changeStep();
    goForward();
    socket.on("location-user", (coords) => {
        console.log("COORDS > ", coords)
        socket.broadcast.emit("location-user", coords);
    })
})