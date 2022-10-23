require('dotenv').config();
import { DataSource } from 'typeorm';
import { app } from './app';
import { initPostgressDb } from '@database/postgres';
import { CountryCrud } from '@core';

const port = process.env.PORT || 3000;

async function executeTasksAfterRunServer (): Promise<void> {
  const dbSource: DataSource = await initPostgressDb();
  (global as any).dbSource = dbSource;
  const countryCrud: CountryCrud= new CountryCrud();
  countryCrud.createMany([{ // TODO: create migration to countries catalogue
    code: 'SU',
    name: 'Sudan'
  }]);
  return;
}

app.listen(port, async () => {
  await executeTasksAfterRunServer();
  console.info(`Server runing in port: ${port}`);
});
