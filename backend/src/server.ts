const http = require('http');
import { v4 as uuidv4 } from 'uuid';
import { connection } from 'websocket';

const websocketServer = require('websocket').server;
const httpServer = http.createServer();
httpServer.listen(9090, () => console.log('Listening.. on 9090'));

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
let timeoutState: NodeJS.Timeout;

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

    if (result.method == 'get') {
      const clientId = result.clientId;
      const sessionId = result.sessionId;
      const payload = {
        method: 'get',
        session: sessions[sessionId],
      };
      //sends out session data
      const con = clients[clientId].connection;
      con.send(JSON.stringify(payload));
    }
    if (result.method === 'create') {
      const clientId = result.clientId;
      const clientName = result.name;
      console.log(clients[clientId]);
      console.log(clients, clientId);
      //create a session
      if (clientId && clientName) {
        clients[clientId].name = clientName;
        const sessionId = uuidv4();
        sessions[sessionId] = {
          id: sessionId,
          host: clientId,
          participants: [],
          timer: 0,
        };

        const payload = {
          method: 'create',
          session: sessions[sessionId],
        };

        const con = clients[clientId].connection;
        con.send(JSON.stringify(payload));
      }
    }

    if (result.method === 'join') {
      //add a client to a session
      const clientId = result.clientId;
      const sessionId = result.sessionId;
      const session = sessions[sessionId];
      const name = result.name;
      clients[clientId].name = name;

      session.participants.push({
        clientId: clientId,
        name: name,
      });

      const payload = {
        method: 'join',
        session: session,
        hostName: clients[session.host].name,
      };

      clients[session.host].connection.send(JSON.stringify(payload));
      //send clients in session the updated session data
      session.participants.forEach((c) => {
        clients[c.clientId].connection.send(JSON.stringify(payload));
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
        session.timer = timer;
        const payload = {
          method: 'timerUpdate',
          session: session,
        };
        updateTimerState();

        session.participants.forEach((c) => {
          clients[c.clientId].connection.send(JSON.stringify(payload));
        });
      }
    }
  });
  const clientId = uuidv4();
  clients[clientId] = {
    id: clientId,
    connection: connection,
  };

  const payload = {
    method: 'connect',
    clientId: clientId,
  };
  //send back the client connect
  console.log(payload);
  connection.send(JSON.stringify(payload));
});
//function to update timer every second and send the information across all the connections within sessions
function updateTimerState() {
  clearTimeout(timeoutState);

  for (const sessionId of Object.keys(sessions)) {
    const session = sessions[sessionId];
    if (session.timer > 0) {
      session.timer--;
      const payload = {
        method: 'timerUpdate',
        session: session,
      };

      session.participants.forEach((c) => {
        clients[c.clientId].connection.send(JSON.stringify(payload));
      });
    }
  }

  timeoutState = setTimeout(updateTimerState, 1000);
}
