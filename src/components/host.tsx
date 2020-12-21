import React,{useState} from "react";
import {ws} from "../App"




function HostComponent(props:any) {
    console.log(props)
     ws.onmessage = message => {
        //message.data
        const response = JSON.parse(message.data);
    
        if(response.method == "join"){
            console.log(response)
          
         
        }
        
       
        //connect
      }

    
 
  
  
   
  
    
   
    return (
    
        <div>
            Hello
        </div>
     
    );
  }
  
  export default HostComponent;