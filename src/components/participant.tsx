import React, { useState, useEffect } from 'react';
import { ws } from '../App';
import { Howl } from 'howler';

const sound = new Howl({ src: ['/sound.mp3'] });

function ParticipantComponent(props: any) {
  const [timer, setTimer] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [participantId, setParticipantId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [playSound, setPlaySound] = useState(false);

  const [participantName, setParticipantName] = useState('');

  useEffect(() => {
    setParticipantName(prompt('What is your name'));
  }, []);

  useEffect(() => {
    if (playSound) {
      sound.play();
      setPlaySound(false);
    }
    console.log(participantName);
  }, [timer]);

  console.log(props);

  ws.onmessage = (message) => {
    //message.data
    const response = JSON.parse(message.data);

    if (response.method == 'connect') {
      const clientId = response.clientId;
      setParticipantId(clientId);

      const sessionIdNum = props.match.params.sessionId;
      setSessionId(sessionIdNum);
      const payLoad = {
        method: 'join',
        clientId,
        name: participantName,
        sessionId: sessionIdNum,
      };

      ws.send(JSON.stringify(payLoad));
    }
    if (response.method == 'join') {
      const sessionParticipants = response.session.participants;
      const otherParticipants = sessionParticipants.filter(
        (participant) => participant.clientId !== participantId
      );
      setParticipants(otherParticipants);
      setTimer(response.session.timer);
    }

    if (response.method == 'timerUpdate') {
      const time = response.session.timer;

      if (time == 0) {
        setPlaySound(true);
      }
      setTimer(time);
    }
    console.log(participants, timer);
  };

  return (
    <div>
      Hello I am participant
      <h1>dfd{JSON.stringify(participants)}</h1>
      <h2>{participantName}</h2>
      {timer}
    </div>
  );
}

export default ParticipantComponent;
