import React,{useState} from "react";
import {ws} from "../App"
import Button from '@material-ui/core/Button';






function HostComponent(props:any) {
    const [timer,setTimer] = useState(null);
    // const [sessionId,setSessionId] = useState("")

    let sessionId = props.match.params.sessionId;
    let hostId = props.match.params.hostId;

    
    const addTime = (time:number) => {
        setTimer(time);
        const payLoad = {
            method:"timerUpdate",
            clientId:hostId,
            sessionId,
            timer:time
        }
        ws.send(JSON.stringify(payLoad))
        

    }
   
     ws.onmessage = message => {
        //message.data
        const response = JSON.parse(message.data);
        console.log(response)
    
        if(response.method == "join"){
            console.log(response)
          
         
        }
        
       
        //connect
      }

    
 
  
  
   
  
    
   
    return (
    
        <div>
            Hello
        

        <div>
    <Button variant="contained" color="primary" onClick = {() => addTime(15)}>
      15s
    </Button>
    <Button variant="contained" color="primary" onClick = {() => addTime(30)} >
      30s
    </Button>



        </div>
        </div>
           
     
    );
  }
  
  export default HostComponent;