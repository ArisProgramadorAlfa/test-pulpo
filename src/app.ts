import express from 'express';
import cors from 'cors';
import { router } from './api/routes';
import randomBytes from 'randombytes';
import morgan from 'morgan';
import moment from 'moment';

class App {

  public app: express.Application;

  private assignIDToRequest(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    (req as any).id = randomBytes(8).toString('hex').slice(0, 5);
    return next();
  }

  private configMorgan() {
    this.app.use(morgan(function (tokens, req, res) {
      return [
        '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
        '\n' + moment().format('YYYY-MM-DD HH:mm:ss'),
        `[ ${(req as any).id} ]`,
        tokens.method(req, res),
        tokens.url(req, res),
        `\nbody: ${JSON.stringify((req as any).body || {}, null, 4)}`,
        `\nquery: ${JSON.stringify((req as any).query || {}, null, 4)}`,
      ].join(' ')
    }, { immediate: true }));
    this.app.use(morgan(function (tokens, req, res) {
      return [
        moment().format('YYYY-MM-DD HH:mm:ss'),
        `[ ${(req as any).id} ]`,
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
        '\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
      ].join(' ')
    }));
    return;
  }

  private config() {
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(this.assignIDToRequest);
    this.configMorgan();
    this.app.use('/', router);
  }

  constructor() {
    this.app = express();
    this.config()
  }
}

export const app = new App().app;