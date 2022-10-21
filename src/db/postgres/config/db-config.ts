export interface IDBConfigAttributes {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  dropSchema: boolean;
  migrationsRun: boolean;
}

export interface IDBConfig {
  local: IDBConfigAttributes;
  test: IDBConfigAttributes;
  development: IDBConfigAttributes;
  production: IDBConfigAttributes;
  [keyof: string]: IDBConfigAttributes;
}

const dataBaseConfigurations: IDBConfig = {
  local: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME_LOCAL!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10) || 5433,
    type: process.env.DB_DIALECT!,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    dropSchema: process.env.DB_DROP === 'true',
    migrationsRun: process.env.DB_MIGRATIONS === 'true',
  },
  test: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME_TEST!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10) || 5433,
    type: process.env.DB_DIALECT!,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    dropSchema: process.env.DB_DROP === 'true',
    migrationsRun: process.env.DB_MIGRATIONS === 'true',
  },
  development: {
    username: process.env.DB_USER as any,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME_DEVELOPMENT!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10) || 5433,
    type: process.env.DB_DIALECT!,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    dropSchema: process.env.DB_DROP === 'true',
    migrationsRun: process.env.DB_MIGRATIONS === 'true',
  },
  production: {
    username: process.env.DB_USER!,
    password: process.env.DB_PASS!,
    database: process.env.DB_NAME_PRODUCTION!,
    host: process.env.DB_HOST!,
    port: parseInt(process.env.DB_PORT!, 10) || 5433,
    type: process.env.DB_DIALECT!,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    logging: process.env.DB_LOGGING === 'true',
    dropSchema: process.env.DB_DROP === 'true',
    migrationsRun: process.env.DB_MIGRATIONS === 'true',
  }
};
const enviroment: string = process.env.NODE_ENV || 'development';
const dbConfig: IDBConfigAttributes = dataBaseConfigurations[enviroment];
export {
  dbConfig
};
