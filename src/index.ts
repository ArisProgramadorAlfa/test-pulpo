require('dotenv').config();
import { DataSource } from 'typeorm';
import { app } from './app';
import { initPostgressDb } from '@database/postgres';

const port = process.env.PORT || 3000;

async function executeTasksAfterRunServer (): Promise<void> {
  const dbSource: DataSource = await initPostgressDb();
  (global as any).dbSource = dbSource;
  return;
}

app.listen(port, async () => {
  await executeTasksAfterRunServer();
  console.info(`Server runing in port: ${port}`);
});
