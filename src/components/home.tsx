import React, { useState, useEffect } from 'react';
import { ws } from '../App';
import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  test: {
    backgroundColor: 'red',
  },
}));

function HomeComponent() {
  const classes = useStyles();
  const history = useHistory();
  const [showJoinButton, setShowJoinButton] = useState(false);

  const [sessionId, setSessionId] = useState('');
  const [clientId, setClientId] = useState('');
  const [name, setName] = useState('');

  function createRoom() {
    const payLoad = {
      method: 'create',
      clientId: clientId,
      name: name,
    };

    ws.send(JSON.stringify(payLoad));
  }

  ws.onmessage = (message) => {
    //message.data
    const response = JSON.parse(message.data);
    if (response.method == 'connect') {
      setClientId(response.clientId);
    }
    if (response.method == 'create') {
      setSessionId(response.session.id);

      setShowJoinButton(true);
    }

    //connect
  };

  return (
    <div className={classes.root}>
      <h1>Websockets</h1>
      <Grid
        container
        spacing={2}
        justify='center'
        alignItems='center'
        style={{ height: '400px' }}
      >
        <Grid>
          <TextField
            id='standard-basic'
            label='Enter Name'
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid>
          <Button variant='contained' color='primary' onClick={createRoom}>
            Create Room
          </Button>
        </Grid>

        <Grid item container direction='column' spacing={2}>
          {showJoinButton && (
            <div>
              <Grid item>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() =>
                    history.push(`/host/${name}/${clientId}/${sessionId}`)
                  }
                >
                  Enter Room
                </Button>
              </Grid>

              <Grid item>
                <p>Use the link below to join as a participant</p>
                <a
                  href={`/participant/${sessionId}`}
                >{`http:localhost:3000/participant/${sessionId}`}</a>
              </Grid>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default HomeComponent;
