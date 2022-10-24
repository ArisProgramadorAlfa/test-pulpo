# test-pulpo

Este es un proyecto hecho con ```Express js y Typescript.```

## Installation de módulos

Antes de correr la app se deben instalar las dependencias con el siguiente comando en la raíz del proyecto
```bash
$ npm install
```

## Configuración

En la raíz del proyecto se debe crear un archivo ```.env``` el cual contandrá la configuración de la base de datos, el puerto por el cual se levantará el servidor, etc. Hay un archivo ```.env.example``` en la raíz del proyecto el cual se puede usar como base para llenar los datos correspondientes.

## Base de datos

El proyecto se probo con una base de datos de postgres.

### Configuración de la base de datos

1. Para crear la base de datos es necesario ajustar las siguientes variables en el archivo ```.env```;

```bash
DB_MIGRATIONS=false
DB_DROP=true
DB_SYNCHRONIZE=true
```

Una vez modificadas se debe levantar el proyecto por primera vez con el siguiente comando, según sea el caso:
```
$ npm run start:dev
$ npm run start:prod
```

Una vez que se haya levantado la aplicación, la base de datos estara creada correctamente y se debe dejar de ejecutar la aplicación para continuar con el siguiente paso.

2. La siguiente configuración es la que debe ir por default en el archivo ```.env```para que no se borre la base de datos cada vez que se redeploye la aplicación:

```
DB_MIGRATIONS=true
DB_DROP=false
DB_SYNCHRONIZE=false
```

## Levantar la app

```bash
# development
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Consumir servicios mediante cli

Actualemte se agregaron dos scripts en el archivo ```packages.json``` para consumir los servicios del proyecto
mediante un comando (cli), estos scripts se les puede enviar el country code por parametro de manera opcional, 
si no se manda este, tomara por default ```SD```, ejemplo:


1. Script para crear el ranking a partir de los datos obtenidos de la API de IATI
```
start:cli-create-ranking --countryCode SD
```

2. Script para obtener el ranking de la base de datos local
```
start:cli-get-ranking --countryCode SD
```

## Pruebas

```bash
# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
