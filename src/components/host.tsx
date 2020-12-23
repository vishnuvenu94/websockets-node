import React, { useState, useEffect } from 'react';
import { ws } from '../App';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { IconButton } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import VideocamOffRoundedIcon from '@material-ui/icons/VideocamOffRounded';
import MicOffRoundedIcon from '@material-ui/icons/MicOffRounded';
import CallEndRoundedIcon from '@material-ui/icons/CallEndRounded';

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
  timerButtons: {
    borderStyle: 'solid',
    border: 1,
    cursor: 'pointer',
    height: '50px',
    width: '50px',
    borderRadius: '50%',
  },
  image: {
    height: '400px',
    width: '400px',
  },
  paperParent: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  paper: {
    height: '300px',
    width: '800px',
    margin: 'auto',
    fontSize: '3em',
  },
}));

export interface Participant {
  clientId: string;
  name: string;
}

function HostComponent(props: any) {
  const classes = useStyles();

  const [sessionId] = useState(props.match.params.sessionId);
  const [hostId] = useState(props.match.params.hostId);
  const [hostName] = useState(props.match.params.hostName);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const payload = {
      method: 'get',
      sessionId,
      clientId: hostId,
    };
    if (ws.readyState == 1) {
      ws.send(JSON.stringify(payload));
    }
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
        {!participants.length && (
          <div className={classes.paperParent} style={{ textAlign: 'center' }}>
            <Paper elevation={3} className={classes.paper}>
              <p>No participants yet</p>
            </Paper>
          </div>
        )}

        <Grid container spacing={1}>
          {participants.map((participant: Participant) => {
            return (
              <Grid
                item
                style={{ border: 1, borderStyle: 'solid' }}
                key={participant.clientId}
              >
                <img
                  className={classes.image}
                  src='/Placeholder_person.png'
                  alt='placeholder'
                ></img>
                <p>User Name:{participant.name}</p>
              </Grid>
            );
          })}

          {participants.length > 0 && (
            <Grid item container spacing={1} style={{ marginTop: '30px' }}>
              <Grid item container xs={6} justify='flex-end' spacing={1}>
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
                    <PeopleAltRoundedIcon></PeopleAltRoundedIcon>
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton classes={{ root: classes.icon }}>
                    <CallEndRoundedIcon></CallEndRoundedIcon>
                  </IconButton>
                </Grid>
              </Grid>
              <Grid item container xs={6} spacing={1} justify='center'>
                <Grid item>
                  <IconButton
                    onClick={() => addTime(15)}
                    classes={{ root: classes.timerButtons }}
                  >
                    15s
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => addTime(30)}
                    classes={{ root: classes.timerButtons }}
                  >
                    30s
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => addTime(45)}
                    classes={{ root: classes.timerButtons }}
                  >
                    45s
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => addTime(60)}
                    classes={{ root: classes.timerButtons }}
                  >
                    60s
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
}

export default HostComponent;
