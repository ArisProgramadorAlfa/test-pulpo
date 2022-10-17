import { Request, Response } from 'express';
import { HttpStatus } from '../../core';
// import { HttpStatus } from '@core';

async function home(req: Request, res: Response) {
  try {
    return res.status(HttpStatus.ok).json('Hello world !');
  } catch (error) {
    console.error('Error to get hello world:', error);
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
