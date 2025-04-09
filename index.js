import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
  }
  );
  
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  }
  );