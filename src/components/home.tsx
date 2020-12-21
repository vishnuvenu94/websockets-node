import React,{useState} from "react";
import {ws} from "../App"
import TextField from '@material-ui/core/TextField';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';




function HomeComponent() {
    const history = useHistory();
 
  let name;
  let clientId
 



  function createRoom(){
    console.log(name)
    
    const payLoad = {
      "method": "create",
      "clientId": clientId,
      "name":name
      
  }
  console.log(clientId)
  
  ws.send(JSON.stringify(payLoad));
  }

  



  ws.onmessage = message => {
    //message.data
    const response = JSON.parse(message.data);
    if(response.method == "connect"){
      clientId = response.clientId

    }
    if(response.method == "create"){
        console.log(response)
      
      history.push(`/host/${clientId}/${response.session.id}`);
    }
    
   
    //connect
  }

 
  
  
   
  
    
   
    return (
    
        <div>
             <TextField id="standard-basic" label="Standard" onChange={(e)=> name = e.target.value}/>
      <Button variant="contained" color="primary" onClick={createRoom}>
      Create Room
    </Button>
        </div>
     
    );
  }
  
  export default HomeComponent;