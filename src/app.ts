// Dependencies
import express from 'express'
import cors from 'cors'
import http from 'http'
import Router from './router'

// App
class App {
  public express: express.Express
  public server: http.Server

  public constructor () {
    this.express = express();

    this.middewwares();

    new Router(this.express)

    this.server = http.createServer(this.express);
  }

  private middewwares () {
    this.express.use(express.json());

    // Set CORS headers
    this.express.use(cors());
    this.express.use((req, res, next) => {
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

      next();
    });
  }
}

export default new App().server