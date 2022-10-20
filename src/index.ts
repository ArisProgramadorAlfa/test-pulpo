require('dotenv').config();
import { app } from './app';

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.info(`Server runing in port: ${port}`);
});
