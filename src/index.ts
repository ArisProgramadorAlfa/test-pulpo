require('dotenv').config();
import { DataSource } from 'typeorm';
import { app } from './app';
import { initPostgressDb } from '@database/postgres';
import { CountryCrud, RankingIATIUsecase } from '@core';

const port = process.env.PORT || 3000;

async function executeTasksAfterRunServer (): Promise<void> {
  const dbSource: DataSource = await initPostgressDb();
  (global as any).dbSource = dbSource;
  const countryCrud: CountryCrud= new CountryCrud();
  const countrySu = await countryCrud.findOrCreate({ // TODO: create migration to countries catalogue
    code: 'SD',
    name: 'Sudan'
  });
  const rankingUseCase: RankingIATIUsecase = new RankingIATIUsecase();
  await rankingUseCase.createRanking(countrySu.code, 5);
  return;
}

app.listen(port, async () => {
  await executeTasksAfterRunServer();
  console.info(`Server runing in port: ${port}`);
});
