import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import userRoutes from './routes/user.js';
import { initializeApp } from 'firebase-admin/app';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
  }
);
  
app.use('/users', userRoutes);
  
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  }
  );