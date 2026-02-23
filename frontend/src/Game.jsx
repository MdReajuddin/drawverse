import {useState,useEffect} from "react"

import Whiteboard from "./Whiteboard"

import Timer from "./Timer"

import "./style.css"

import {io} from "socket.io-client"



const socket=io("https://drawverse-server.onrender.com")



export default function Game(){



const savedName=

localStorage.getItem("name")||""



const [name,setName]=useState(savedName)

const [room,setRoom]=useState("")

const [joined,setJoined]=useState(false)



const [players,setPlayers]=useState([])

const [scores,setScores]=useState({})

const [leaderboard,setLeaderboard]=useState({})



const [word,setWord]=useState("")

const [chat,setChat]=useState([])

const [msg,setMsg]=useState("")

const [time,setTime]=useState(60)

const [round,setRound]=useState("")

const [winner,setWinner]=useState("")



function join(){



localStorage.setItem("name",name)



socket.emit("joinRoom",{

name:name,

room:room

})



setJoined(true)

}



useEffect(()=>{

socket.on("players",setPlayers)

socket.on("scores",setScores)

socket.on("word",setWord)

socket.on("timer",setTime)

socket.on("round",setRound)

socket.on("leaderboard",setLeaderboard)



socket.on("chat",(m)=>{

setChat(old=>[...old,m])

})



socket.on("winner",(w)=>{

setWinner(w)

})



},[])



if(!joined){

return(

<div className="login">

<h1>🎮 DrawVerse GOD</h1>



<input

placeholder="Name"

value={name}

onChange={(e)=>

setName(e.target.value)

}

/>



<input

placeholder="Room"

onChange={(e)=>

setRoom(e.target.value)

}

/>



<button onClick={join}>

Join

</button>

</div>

)

}



return(

<div className="container">



{winner &&

<div className="winner">

{winner}

</div>

}



<div className="sidebar">



<h2>Room {room}</h2>



<Timer time={time}/>



<h3>{round}</h3>



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

{n}:{scores[n]}

</div>

))

}



<h3>🏆 Global</h3>

{

Object.keys(leaderboard).map(n=>(

<div key={n}>

{n}:{leaderboard[n]}

</div>

))

}



<button

onClick={()=>

socket.emit("start",room)

}

>

Start

</button>



</div>



<div className="main">



<h2>

Word:{word}

</h2>



<Whiteboard

socket={socket}

room={room}

/>



</div>



<div className="chat">



<div className="chatBox">

{

chat.map((c,i)=>(

<div key={i}>{c}</div>

))

}

</div>



<input

value={msg}

onChange={(e)=>setMsg(e.target.value)}

/>



<button

onClick={()=>{

socket.emit("chat",{

room:room,

msg:msg,

name:name

})

setMsg("")

}}

>

Send

</button>



<input

placeholder="Guess"

onKeyDown={(e)=>{

if(e.key==="Enter"){

socket.emit("guess",{

room:room,

guess:e.target.value,

name:name

})

e.target.value=""

}

}}

/>



</div>



</div>

)

}