// import * as dotenv from 'dotenv';
require('dotenv').config();
import { app } from './app';

// dotenv.config();

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.info(`Server runing in port: ${port}`);
});
