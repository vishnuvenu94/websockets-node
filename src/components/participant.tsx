import React,{useState} from "react";
import {ws} from "../App"



let participantName = "sds"
function ParticipantComponent(props:any) {
    const [timer,setTimer] = useState(0);
    const [participants,setParticipants] = useState([]);
    const [participantId,setParsipitantId] = useState("");
    const [sessionId,setSessionId] = useState("");
   

    
   
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
            setTimer(response.session.timer)
            console.log(response.session.timer)
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