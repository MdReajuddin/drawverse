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

let leaderboard={};



const words=[

"dragon",

"robot",

"castle",

"spaceship",

"alien",

"ghost",

"ninja",

"wizard",

"monster",

"pirate",

"volcano",

"airplane",

"submarine",

"zombie",

"superhero",

"guitar",

"piano",

"violin",

"microphone",

"drum"

];



function randomWord(){

return words[

Math.floor(

Math.random()*words.length

)

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

drawerIndex:0,

round:1,

maxRounds:10,

word:"",

timer:null

};

}



rooms[room].players.push({

id:socket.id,

name:name

});



rooms[room].scores[name]=0;



io.to(room).emit("players",

rooms[room].players

);



io.to(room).emit("scores",

rooms[room].scores

);



});



socket.on("start",(room)=>{

let r=rooms[room];

if(!r)return;



r.drawerIndex=0;

r.round=1;



startRound(room);

});



function startRound(room){

let r=rooms[room];

if(!r)return;



let drawer=r.players[r.drawerIndex];



r.word=randomWord();



io.to(drawer.id)

.emit("word",r.word);



io.to(room)

.emit("round",

"Round "+r.round+" / 10"

);



startTimer(room);

}



function startTimer(room){

let r=rooms[room];

let time=60;



if(r.timer){

clearInterval(r.timer);

}



r.timer=setInterval(()=>{

time--;



io.to(room)

.emit("timer",time);



if(time<=0){

clearInterval(r.timer);

nextRound(room);

}



},1000);

}



function nextRound(room){

let r=rooms[room];

if(!r)return;



r.round++;



if(r.round>r.maxRounds){

r.round=1;

r.drawerIndex++;



if(r.drawerIndex>=r.players.length){



let winner="";

let max=0;



for(let p in r.scores){

if(r.scores[p]>max){

max=r.scores[p];

winner=p;

}

}



io.to(room)

.emit(

"winner",

"🏆 "+winner+

" Wins with "+max+" Points!"

);



return;

}



}



startRound(room);

}



socket.on("draw",(data)=>{

socket.to(data.room)

.emit("draw",data);

});



socket.on("clear",(room)=>{

io.to(room)

.emit("clear");

});



socket.on("chat",(data)=>{

io.to(data.room)

.emit("chat",

data.name+": "+data.msg

);

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



if(!leaderboard[data.name])

leaderboard[data.name]=0;



leaderboard[data.name]+=10;



io.to(data.room)

.emit("scores",r.scores);



io.emit("leaderboard",

leaderboard

);



nextRound(data.room);

}
});
});



server.listen(5000,()=>{

console.log("Server Running");

});