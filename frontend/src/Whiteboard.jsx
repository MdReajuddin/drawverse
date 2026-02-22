import { useRef,useEffect,useState }
from "react";

export default function Whiteboard({socket,room}){

const canvasRef = useRef();

const drawing = useRef(false);

const last = useRef({x:0,y:0});

const [color,setColor] = useState("#000");
const [size,setSize] = useState(4);



useEffect(()=>{

const canvas = canvasRef.current;

const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 500;

ctx.lineCap="round";


socket.on("draw",(d)=>{

ctx.strokeStyle=d.color;

ctx.lineWidth=d.size;

ctx.beginPath();

ctx.moveTo(d.x0,d.y0);

ctx.lineTo(d.x1,d.y1);

ctx.stroke();

});


socket.on("clear",()=>{

ctx.clearRect(
0,0,
900,500
);

});


},[]);



function start(e){

drawing.current=true;

const rect=
canvasRef.current
.getBoundingClientRect();

last.current={

x:e.clientX-rect.left,
y:e.clientY-rect.top

};

}



function stop(){

drawing.current=false;

}



function draw(e){

if(!drawing.current) return;

const rect=
canvasRef.current
.getBoundingClientRect();

const x=
e.clientX-rect.left;

const y=
e.clientY-rect.top;

const ctx=
canvasRef.current
.getContext("2d");


ctx.strokeStyle=color;

ctx.lineWidth=size;


ctx.beginPath();

ctx.moveTo(
last.current.x,
last.current.y
);

ctx.lineTo(x,y);

ctx.stroke();


socket.emit("draw",{

room:room,

x0:last.current.x,
y0:last.current.y,

x1:x,
y1:y,

color:color,
size:size

});


last.current={x,y};

}



return(

<div>

<button

onClick={()=>socket.emit(
"clear",
room
)}

>

Clear

</button>


<input
type="color"
value={color}
onChange={(e)=>setColor(e.target.value)}
/>


<input
type="range"
min="1"
max="20"
value={size}
onChange={(e)=>setSize(e.target.value)}
/>


<br/>


<canvas

ref={canvasRef}

onMouseDown={start}

onMouseUp={stop}

onMouseMove={draw}

>

</canvas>

</div>

);

}