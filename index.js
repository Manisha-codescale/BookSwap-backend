import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import mongoose from 'mongoose';
import bookRoute from './routes/bookRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
  }
);

app.use('/api/book', bookRoute);

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log("Connected to the database.!");
})
.catch(() => {
  console.log("Connection Failed.");
})
  
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  }
);