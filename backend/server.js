const express=require("express");
const http=require("http");
const cors=require("cors");

const {Server}=require("socket.io");

const app=express();

app.use(cors());

const server=http.createServer(app);

const io=new Server(server,{
cors:{origin:"*"}
});

let rooms={};

const words=[
"cat",
"car",
"tree",
"apple",
"phone",
"house"
];

function randomWord(){

return words[
Math.floor(Math.random()*words.length)
];

}

io.on("connection",(socket)=>{

console.log("User Connected");

socket.on("joinRoom",(data)=>{

const {name,room}=data;

socket.join(room);

if(!rooms[room]){

rooms[room]={

players:[],
scores:{},
drawer:null,
word:""

};

}

rooms[room].players.push({

id:socket.id,
name:name

});

rooms[room].scores[name]=0;

io.to(room).emit(
"players",
rooms[room].players
);

io.to(room).emit(
"scores",
rooms[room].scores
);

});

socket.on("start",(room)=>{

let r=rooms[room];

if(!r)return;

r.drawer=r.players[0].id;

r.word=randomWord();

io.to(r.drawer)
.emit("word",r.word);

startTimer(room);

});

function startTimer(room){

let time=60;

let interval=setInterval(()=>{

time--;

io.to(room)
.emit("timer",time);

if(time<=0){

clearInterval(interval);

nextRound(room);

}

},1000);

}

function nextRound(room){

let r=rooms[room];

if(!r)return;

r.word=randomWord();

let next=r.players[
Math.floor(
Math.random()*r.players.length
)
];

r.drawer=next.id;

io.to(next.id)
.emit("word",r.word);

startTimer(room);

}

socket.on("draw",(data)=>{

socket.to(data.room)
.emit("draw",data);

});

socket.on("chat",(data)=>{

io.to(data.room)
.emit("chat",data.msg);

});

socket.on("guess",(data)=>{

let r=rooms[data.room];

if(!r)return;

if(
data.guess.toLowerCase()
===
r.word.toLowerCase()
){

r.scores[data.name]+=10;

io.to(data.room)
.emit("scores",r.scores);

nextRound(data.room);

}

});

socket.on("clear",(room)=>{

io.to(room)
.emit("clear");

});

});

server.listen(5000,()=>{

console.log("Server Running");

});