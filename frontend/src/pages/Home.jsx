import {useState} from "react"
import {useNavigate} from "react-router-dom"

function Home(){

const[name,setName]=useState("")

const nav=useNavigate()

function createRoom(){

const id=Math.random().toString(36).substring(7)

localStorage.setItem("name",name)

nav("/room/"+id)

}

return(

<div className="home">

<h1>DrawVerse 🎨</h1>

<input

placeholder="Enter Name"

onChange={(e)=>setName(e.target.value)}

/>

<button onClick={createRoom}>

Create Room

</button>

</div>

)

}

export default Home