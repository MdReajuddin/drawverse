import { useState, useEffect } from "react";

import Whiteboard from "./Whiteboard";
import VoiceChat from "./VoiceChat";
import Timer from "./Timer";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Game() {

const [name,setName] = useState("");
const [room,setRoom] = useState("");

const [joined,setJoined] = useState(false);

const [players,setPlayers] = useState([]);
const [scores,setScores] = useState({});

const [word,setWord] = useState("");

const [chat,setChat] = useState([]);
const [msg,setMsg] = useState("");

const [time,setTime] = useState(60);



function join(){

socket.emit("joinRoom",{
name:name,
room:room
});

setJoined(true);

}



useEffect(()=>{

socket.on("players",setPlayers);

socket.on("scores",setScores);

socket.on("word",setWord);

socket.on("timer",setTime);

socket.on("chat",(m)=>{

setChat(old=>[...old,m]);

});

},[]);



if(!joined){

return(

<div style={{
textAlign:"center",
marginTop:"100px"
}}>

<h1>DrawVerse ULTRA</h1>

<input
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>

<br/>

<input
placeholder="Room ID"
onChange={(e)=>setRoom(e.target.value)}
/>

<br/>

<button onClick={join}>

Join Room

</button>

</div>

);

}



return(

<div className="container">

<div className="sidebar">

<h2>Room: {room}</h2>

<Timer time={time}/>

<h3>Players</h3>

{

players.map(p=>(

<div key={p.id}>
👤 {p.name}
</div>

))

}

<h3>Scores</h3>

{

Object.keys(scores).map(n=>(

<div key={n}>
{n} : {scores[n]}
</div>

))

}

<button

onClick={()=>socket.emit("start",room)}

>

Start Game

</button>


<VoiceChat/>


</div>



<div className="main">

<h2>Word: {word}</h2>

<Whiteboard
socket={socket}
room={room}
/>

</div>



<div className="chat">

<h3>Chat</h3>

<div style={{

height:"300px",
overflow:"auto"

}}>

{

chat.map((c,i)=>(

<div key={i}>
{c}
</div>

))

}

</div>


<input

placeholder="Message"

value={msg}

onChange={(e)=>setMsg(e.target.value)}

/>


<button

onClick={()=>{

socket.emit("chat",{

room:room,
msg:msg

});

setMsg("");

}}

>

Send

</button>


<br/>


<input

placeholder="Guess"

onKeyDown={(e)=>{

if(e.key==="Enter"){

socket.emit("guess",{

room:room,
guess:e.target.value,
name:name

});

e.target.value="";

}

}}

>


</input>


</div>

</div>

);

}