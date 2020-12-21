import React,{useState} from "react";
import {ws} from "../App"




function ParticipantComponent(props:any) {
    let participantName;
    let participantId;
    console.log(props)
     ws.onmessage = message => {
        //message.data
        const response = JSON.parse(message.data);
        console.log(response)
    
        if(response.method == "connect"){
            participantId=response.clientId;
            participantName = prompt("Please enter your user name.");
            const sessionId = props.match.params.sessionId
            const payLoad = {
                method:"join",
                clientId:participantId,
                name:participantName,
                sessionId

            }

            ws.send(JSON.stringify(payLoad));

          
         
        }
        
       
        //connect
      }

    
 
  
  
   
  
    
   
    return (
    
        <div>
            Hello I am participant
        </div>
     
    );
  }
  
  export default ParticipantComponent;