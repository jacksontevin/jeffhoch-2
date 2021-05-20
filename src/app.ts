import cors from '@koa/cors';

import Koa from 'koa';

import config from 'config';

import bodyParser from 'koa-bodyparser';

import database from './database';
import routes from './routes';

import chatService from './services/chat.services';
import logger from './utils/logger';
import { notificationSocket } from './middleware/notification';


database();
const app = new Koa();

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    credentials: false
  }
});

io.listen(4003);
io.on('connection', socket => {
  chatService(socket, io)
  // notificationSocket(socket, io)
});

app.use(cors());

app.use(routes.middleware());
app.use(bodyParser());
app.on('error', (error) => {
  logger.error(error, 'application error');
});


app.listen(config.get('port'), () => {
  logger.info(`server listening on port : ${config.get('port')} `);
});


