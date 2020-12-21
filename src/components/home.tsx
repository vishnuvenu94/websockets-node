import React,{useState,useEffect} from "react";
import {ws} from "../App"
import TextField from '@material-ui/core/TextField';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';





function HomeComponent() {
    const history = useHistory();
    const [showJoinButton,setShowJoinButton] = useState(false);
   
    const [sessionId,setSessionId] = useState("")
    const [clientId,setClientId] = useState("")
    const [name,setName] = useState("")
    


 
 
  
 



  function createRoom(){
    
    
    const payLoad = {
      "method": "create",
      "clientId": clientId,
      "name":name
      
  }
  
  
  ws.send(JSON.stringify(payLoad));
  }

  



  ws.onmessage = message => {
    //message.data
    const response = JSON.parse(message.data);
    if(response.method == "connect"){
      setClientId(response.clientId)

    }
    if(response.method == "create"){
        
         setSessionId(response.session.id);
       

    setShowJoinButton(true);
    
   


    }
    
   
    //connect
  }

 
  
  
   
  
    
   
    return (
    
        <div>
             <TextField id="standard-basic" label="Standard" onChange={(e)=> setName(e.target.value)}/>
      <Button variant="contained" color="primary" onClick={createRoom}>
      Create Room
    </Button>
    {showJoinButton && (<div>
      <Button variant="contained" color="primary" onClick={()=>history.push(`/host/${clientId}/${sessionId}`)}>
      Join Room 
    </Button>
    
    <a href={`/participant/${sessionId}`}>{`http:localhost:3000/participant/${sessionId}`}</a>
    </div>)
    }

        </div>
     
    );
  }
  
  export default HomeComponent;