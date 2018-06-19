import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import fs from 'fs';

//import Router from './Router';

import SERVER_CONFIG from '../../config/server.config.json';

class RestServer {
  constructor() {
    /*Connection
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      });*/

    /*
    this.app = express();
    this.app.use(cors());
    this.app.use(bodyParser.urlencoded({
      extended: false,
    }));
    this.app.use(bodyParser.json());
    this.app.use(morgan('common', {
      stream: fs.createWriteStream('./logs/access.log', {
        flags: 'a',
      }),
    }));
    this.app.use(morgan('dev'));


     Connection.connect()
      .then(() => {
        this.router = new Router(this.app);
        this.start();
      }); */
  }

  start() {
    this.app.listen(SERVER_CONFIG.port, this.connected);
    this.app.on('error', () => {
      console.log('Fuck off');
    });
  }

  connected() {
    console.log(`✔️  REST API CONNECTED PORT: ${SERVER_CONFIG.port}`);
  }
}
module.exports = RestServer;