import React, { useState, useEffect } from 'react';
import { ws } from '../App';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

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
    cursor: 'pointer',
  },
  image: {
    height: '400px',
    width: '400px',
  },
}));

function HostComponent(props: any) {
  const classes = useStyles();

  const [sessionId] = useState(props.match.params.sessionId);
  const [hostId] = useState(props.match.params.hostId);
  const [hostName] = useState(props.match.params.hostName);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    console.log('test');
    const payload = {
      method: 'get',
      sessionId,
      clientId: hostId,
    };
    ws.send(JSON.stringify(payload));
  }, []);

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

    if (response.method == 'join' || response.method == 'get') {
      const sessionParticipants = response.session.participants;
      console.log(sessionParticipants);

      setParticipants(sessionParticipants);
    }
  };

  return (
    <div>
      <div className={classes.root}>
        <Grid container spacing={1}>
          {!participants.length && (
            <div>
              <p>No other participants yet</p>
            </div>
          )}
          {participants.map((participant) => {
            return (
              <Grid item key={participant.clientId}>
                <img
                  className={classes.image}
                  src='/Placeholder_person.png'
                  alt='placeholder'
                ></img>
                <p>User Name:{participant.name}</p>
              </Grid>
            );
          })}
        </Grid>
        {/* <h1>dfd{JSON.stringify(participants)}</h1> */}
      </div>

      <div>
        Hello
        <div>
          <Button
            variant='contained'
            color='primary'
            onClick={() => addTime(15)}
          >
            15s
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => addTime(30)}
          >
            30s
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => addTime(45)}
          >
            45s
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={() => addTime(60)}
          >
            60s
          </Button>
          {hostName}
          {participants.length}
        </div>
      </div>
    </div>
  );
}

export default HostComponent;
