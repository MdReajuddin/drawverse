import {useState,useEffect} from "react"
import io from "socket.io-client"

const socket=io("http://localhost:5000")

function Chat(){

const[msg,setMsg]=useState("")
const[list,setList]=useState([])

function send(){

socket.emit("chat",msg)

setMsg("")

}

useEffect(()=>{

socket.on("chat",(m)=>{

setList(old=>[...old,m])

})

},[])

return(

<div>

{

list.map((m,i)=>(

<p key={i}>{m}</p>

))

}

<input

value={msg}

onChange={(e)=>setMsg(e.target.value)}

/>

<button onClick={send}>

Send

</button>

</div>

)

}

export default Chat