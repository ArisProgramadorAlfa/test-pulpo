import { Request, Response } from 'express';
import { HttpStatus, Logger } from './../../core';

const logger: Logger = new Logger(
  'home',
  'home.controller.ts'
)

async function home(req: Request, res: Response) {
  try {
    logger.info({
      logKey: 'home/',
      data: {
        requestId: (req as any).id
      }
    });
    return res.status(HttpStatus.ok).json('Hello world !');
  } catch (error) {
    logger.error({
      logKey: 'home/',
      error
    });
    return res.status(HttpStatus.internalServerError).json({
      error: {
        message: 'Error to get current word.',
        details: (error as any).message
      }
    });
  }
}

export {
  home
};
