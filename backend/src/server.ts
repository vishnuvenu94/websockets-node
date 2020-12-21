const http = require('http');
import { v4 as uuidv4 } from 'uuid';
// const app = require('express')();
// app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

// app.listen(9091, () => console.log('Listening on http port 9091'));
const websocketServer = require('websocket').server;
import { connection } from 'websocket';
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log('Listening.. on 9090'));
//hashmap clients

interface Session {
  id: string;
  host: string;
  participants: any[];
  timer: number;
}

interface Client {
  id: string;
  name?: string;
  connection: connection;
}
const clients: { [clientId: string]: Client } = {};
const sessions: { [sessionId: string]: Session } = {};

const wsServer = new websocketServer({
  httpServer: httpServer,
});
wsServer.on('request', (request: any) => {
  //connect
  const connection = request.accept(null, request.origin);
  connection.on('open', () => console.log('opened!'));
  connection.on('close', () => console.log('closed!'));
  connection.on('message', (message: any) => {
    const result = JSON.parse(message.utf8Data);
    //I have received a message from the client
    //a user want to create a new game
    if (result.method === 'create') {
      const clientId = result.clientId;
      const clientName = result.name;
      console.log(clients[clientId]);
      console.log(clients, clientId);

      clients[clientId].name = clientName;
      const sessionId = uuidv4();
      sessions[sessionId] = {
        id: sessionId,
        host: clientId,
        participants: [],
        timer: 0,
      };

      const payLoad = {
        method: 'create',
        session: sessions[sessionId],
      };

      const con = clients[clientId].connection;
      con.send(JSON.stringify(payLoad));
    }

    if (result.method === 'join') {
      const clientId = result.clientId;
      const sessionId = result.sessionId;
      const session = sessions[sessionId];

      session.participants.push({
        clientId: clientId,
      });

      const payLoad = {
        method: 'join',
        session: session,
      };
      //loop through all clients and tell them that people has joined
      session.participants.forEach((c) => {
        clients[c.clientId].connection.send(JSON.stringify(payLoad));
      });
    }

    if (result.method == 'timerUpdate') {
      const sessionId = result.sessionId;
      const clientId = result.clientId;
      const timer = result.timer;
      const session = sessions[sessionId];
      const isHost = session.host === clientId ? true : false;
      console.log(result, isHost);

      if (isHost) {
        session.timer += timer;
        const payLoad = {
          method: 'timerUpdate',
          session: session,
        };
        updateTimerState();

        session.participants.forEach((c) => {
          clients[c.clientId].connection.send(JSON.stringify(payLoad));
        });
      }
    }
  });
  const clientId = uuidv4();
  clients[clientId] = {
    id: clientId,
    connection: connection,
  };

  const payLoad = {
    method: 'connect',
    clientId: clientId,
  };
  //send back the client connect
  console.log(payLoad);
  connection.send(JSON.stringify(payLoad));
});

function updateTimerState() {
  //{"gameid", fasdfsf}
  for (const sessionId of Object.keys(sessions)) {
    const session = sessions[sessionId];
    if (session.timer > 0) session.timer--;
    const payLoad = {
      method: 'timerUpdate',
      session: session,
    };

    session.participants.forEach((c) => {
      clients[c.clientId].connection.send(JSON.stringify(payLoad));
    });
  }

  setTimeout(updateTimerState, 1000);
}
