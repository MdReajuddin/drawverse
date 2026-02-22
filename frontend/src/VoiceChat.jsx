import {useEffect,useRef} from "react";

export default function VoiceChat(){

const audioRef=useRef();

useEffect(()=>{

navigator.mediaDevices
.getUserMedia({audio:true})
.then(stream=>{

audioRef.current.srcObject=
stream;

});

},[]);

return(

<div>

🎤 Voice Active

<audio
ref={audioRef}
autoPlay
/>

</div>

)

}