import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
<<<<<<< HEAD
  console.log('Test');
=======
  console.log('make a change for test');
  console.log('test another');
  console.log('Test on start');

>>>>>>> a91ff9806a4e00be6cb3199d5e97ade85be9eebf
  //check if the key exist, if not will throw an error
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to mongoDb');
  } catch (err) {
    console.error(err);
  }
  app.listen(3000, () => {
    console.log('Listening to port 3000 !');
  });
};

start();
