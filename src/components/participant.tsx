import React,{useState,useEffect} from "react";
import {ws} from "../App"

import {Howl} from "howler";






let participantName = "sds"
const sound = new Howl({src:["/sound.mp3"]})



function ParticipantComponent(props:any) {
    const [timer,setTimer] = useState(null);
    const [participants,setParticipants] = useState([]);
    const [participantId,setParsipitantId] = useState("");
    const [sessionId,setSessionId] = useState("");
    const [playSound,setPlaySound] = useState(false)

    // const [play] = useSound(so);
   
    
        useEffect(()=>{
            if(playSound){
                sound.play();
                setPlaySound(false)
            }

        },[timer])
    
   
    
    
   

    
  
   

    console.log(props)
    
     ws.onmessage = message => {
        //message.data
        const response = JSON.parse(message.data);
        console.log(response)
    
        if(response.method == "connect"){
            const participantId = response.clientId;
            setParsipitantId(participantId);
            
           
            const sessionId = props.match.params.sessionId
            setSessionId(sessionId)
            const payLoad = {
                method:"join",
                clientId:participantId,
                name:participantName,
                sessionId

            }

            ws.send(JSON.stringify(payLoad));

          
         
        }
        if(response.method == "join"){
            setParticipants(response.session.participants);
            setTimer(response.session.timer)
            console.log(participants,timer)
        }

        if(response.method == "timerUpdate"){
           
            const time = response.session.timer;
            console.log(time)
            if(time == 0 ){
                setPlaySound(true)
            }
            setTimer(time)
            
            
        }
        console.log(participants,timer)
        
       
        //connect
      }

    
 
  
  
   
  
    
    
    return (
        
    
        <div>
           
    
      
            Hello I am participant
    <h1>dfd{JSON.stringify(participants)}</h1>
    {timer}
        </div>
     
    );
  }
  
  export default ParticipantComponent;