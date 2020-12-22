import React, { useState } from 'react';
import { ws } from '../App';
import Button from '@material-ui/core/Button';

function HostComponent(props: any) {
  const [sessionId] = useState(props.match.params.sessionId);
  const [hostId] = useState(props.match.params.hostId);
  const [hostName] = useState(props.match.params.hostName);
  const [participants, setParticipants] = useState([]);

  const addTime = (time: number) => {
    const payLoad = {
      method: 'timerUpdate',
      clientId: hostId,
      sessionId,
      timer: time,
    };
    ws.send(JSON.stringify(payLoad));
  };

  ws.onmessage = (message) => {
    //message.data
    const response = JSON.parse(message.data);
    console.log(response);

    if (response.method == 'join') {
      const sessionParticipants = response.session.participants;

      setParticipants(sessionParticipants);
    }
  };

  return (
    <div>
      Hello
      <div>
        <Button variant='contained' color='primary' onClick={() => addTime(15)}>
          15s
        </Button>
        <Button variant='contained' color='primary' onClick={() => addTime(30)}>
          30s
        </Button>
        <Button variant='contained' color='primary' onClick={() => addTime(45)}>
          45s
        </Button>
        <Button variant='contained' color='primary' onClick={() => addTime(60)}>
          60s
        </Button>
        {hostName}
        {participants.length}
      </div>
    </div>
  );
}

export default HostComponent;
