import { Request, Response } from 'express';
import { HttpStatus, Logger, RankingIATIUsecase } from './../../core';

const logger: Logger = new Logger(
  'ranking',
  'ranking.controller.ts'
)

async function getRankingByCountryCodeController(req: Request, res: Response) {
  try {
    const countryCode: string = (req.query.countryCode as string) || 'SD';
    const rankingIATIUsecase: RankingIATIUsecase = new RankingIATIUsecase();
    const result = await rankingIATIUsecase.getRankingByCountryCode(countryCode, 5, logger);
    return res.status(HttpStatus.ok).json(result);
  } catch (error) {
    logger.error({
      logKey: 'getRankingByCountryCodeController',
      error
    });
    return res.status(HttpStatus.internalServerError).json({
      error: {
        message: 'Error to get ranking.',
        details: (error as any).message
      }
    });
  }
}

export {
  getRankingByCountryCodeController
};