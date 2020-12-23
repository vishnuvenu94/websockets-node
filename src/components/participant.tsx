import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import VideocamOffRoundedIcon from '@material-ui/icons/VideocamOffRounded';
import MicOffRoundedIcon from '@material-ui/icons/MicOffRounded';
import CallEndRoundedIcon from '@material-ui/icons/CallEndRounded';
import { ws } from '../App';
import { Howl } from 'howler';
import { Participant } from './host';

import MediaCard from './participantCard';

const sound = new Howl({ src: ['/sound.mp3'] });

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: '25px',
  },
  timer: {
    color: 'red',
    fontSize: '30px',
  },
  icon: {
    borderStyle: 'solid',
    border: 1,
    cursor: 'default',
  },
}));

function ParticipantComponent(props: any) {
  const classes = useStyles();
  const [timer, setTimer] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [participantId, setParticipantId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [hostName, setHostName] = useState('');

  const [playSound, setPlaySound] = useState(false);

  const [participantName, setParticipantName] = useState<String | null>('');

  useEffect(() => {
    setParticipantName(prompt('Please Enter your username'));
  }, []);

  useEffect(() => {
    if (playSound) {
      sound.play();
      setPlaySound(false);
    }
    console.log(participantName);
  }, [timer, hostName]);

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
      console.log(response);
      const sessionParticipants = response.session.participants;

      setHostName(response.hostName);

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
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={4} container spacing={1} direction='column'>
          {!participants.length && (
            <div style={{ textAlign: 'center' }}>
              <p>No other participants yet.</p>
            </div>
          )}
          {participants.map((participant: Participant) => {
            return (
              <Grid item key={participant.clientId}>
                <MediaCard participant={participant} />
              </Grid>
            );
          })}
        </Grid>

        <Grid item xs={8} container direction='column'>
          <Grid item>
            <img
              src='/349-3499617_person-placeholder-person-placeholder.png'
              alt='placeholder'
            ></img>
          </Grid>
          <Grid item>
            <p>Host:{hostName}</p>
          </Grid>

          <Grid item container direction='row' justify='center' spacing={1}>
            <Grid item>
              <IconButton classes={{ root: classes.icon }}>
                <VideocamOffRoundedIcon></VideocamOffRoundedIcon>
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton classes={{ root: classes.icon }}>
                <MicOffRoundedIcon></MicOffRoundedIcon>
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton classes={{ root: classes.icon }}>
                <CallEndRoundedIcon></CallEndRoundedIcon>
              </IconButton>
            </Grid>
          </Grid>
          {timer > 0 && (
            <Grid item className={classes.timer}>
              <p>{timer}s</p>
            </Grid>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default ParticipantComponent;
