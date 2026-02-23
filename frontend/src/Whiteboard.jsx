import {useRef,useEffect,useState} from "react"



export default function Whiteboard({

socket,

room

}){

const canvasRef=useRef(null)

const drawing=useRef(false)



const [color,setColor]=useState("#000000")

const [size,setSize]=useState(5)



const lastX=useRef(0)

const lastY=useRef(0)



useEffect(()=>{



resize()



window.addEventListener(

"resize",

resize

)



socket.on("draw",

drawLine)



socket.on("clear",()=>{

const ctx=

canvasRef.current

.getContext("2d")



ctx.clearRect(

0,0,

canvasRef.current.width,

canvasRef.current.height

)

})



},[])



function resize(){

canvasRef.current.width=600

canvasRef.current.height=400

}



function pos(e){

const rect=

canvasRef.current

.getBoundingClientRect()



if(e.touches){

return{

x:e.touches[0].clientX-rect.left,

y:e.touches[0].clientY-rect.top

}

}



return{

x:e.clientX-rect.left,

y:e.clientY-rect.top

}

}



function start(e){

drawing.current=true

const p=pos(e)

lastX.current=p.x

lastY.current=p.y

}



function move(e){

if(!drawing.current)return



const p=pos(e)



const data={

room,

x0:lastX.current,

y0:lastY.current,

x1:p.x,

y1:p.y,

color,

size

}



drawLine(data)



socket.emit("draw",data)



lastX.current=p.x

lastY.current=p.y

}



function stop(){

drawing.current=false

}



function drawLine(d){

const ctx=

canvasRef.current

.getContext("2d")



ctx.strokeStyle=d.color

ctx.lineWidth=d.size



ctx.beginPath()

ctx.moveTo(d.x0,d.y0)

ctx.lineTo(d.x1,d.y1)

ctx.stroke()

}



return(

<div>



<input

type="color"

onChange={(e)=>

setColor(e.target.value)

}

/>



<input

type="range"

min="1"

max="20"

onChange={(e)=>

setSize(e.target.value)

}

/>



<button

onClick={()=>

socket.emit("clear",room)

}

>

Clear

</button>



<canvas

ref={canvasRef}



onMouseDown={start}

onMouseMove={move}

onMouseUp={stop}



onTouchStart={start}

onTouchMove={move}

onTouchEnd={stop}



style={{

border:"3px solid black",

background:"white"

}}

>



</canvas>



</div>

)

}