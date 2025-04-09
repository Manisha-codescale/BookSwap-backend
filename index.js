import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import mongoose from 'mongoose';
//import { initializeApp } from 'firebase-admin/app';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());



const uri = process.env.MONGODB_URI;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);
app.use('/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
  }
);
  

  
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  }
  );