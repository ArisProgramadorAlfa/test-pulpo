export * from './entities';

import "reflect-metadata";
import { DataSource } from "typeorm";
import * as entitiesFound from "./entities";
import { dbConfig } from './config/db-config';

const initPostgressDb = async (): Promise<DataSource> => {
  try {
    const entities = Object.keys(entitiesFound).map(key => (entitiesFound as any)[key] );
    const dataSource: DataSource = new DataSource({
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      host: dbConfig.host,
      port: dbConfig.port,
      type: dbConfig.type as any,
      synchronize: dbConfig.synchronize,
      logging: dbConfig.logging,
      dropSchema: dbConfig.dropSchema,
      migrationsRun: dbConfig.migrationsRun,
      entities
    });
    const dbSource: DataSource = await dataSource.initialize();
    console.log("Data base has been initialized!");
    return dbSource;
  } catch (error) {
    console.error("Error to initialize Data base:", error);
    return error as any;
  }
}

export {
  initPostgressDb
};
