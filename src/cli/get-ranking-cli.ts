require('dotenv').config();
import { initPostgressDb } from "@database/postgres";
import { DataSource } from "typeorm";
import { IRankingResponse, Logger, RankingIATIUsecase } from "@core";


const loggerLocal: Logger = new Logger(
  'cli',
  'cli.ts',
);

async function getRanking(
  countryCode: string
) {
  const dbSource: DataSource = await initPostgressDb();
  (global as any).dbSource = dbSource;

  const rankingUseCase: RankingIATIUsecase = new RankingIATIUsecase();
  const ranking: IRankingResponse | null = await rankingUseCase.getRankingByCountryCode(countryCode, 5, loggerLocal);
  return ranking;
}


const countryCode = process.argv[2];
loggerLocal.info({
  logKey: 'cli.ranking',
  message: 'Starting...'
});
getRanking(countryCode).then(ranking => {
  loggerLocal.info({
    logKey: 'cli.ranking',
    data: { ranking }
  });
});
loggerLocal.info({
  logKey: 'cli.ranking',
  message: 'Finish proccess.'
});





