import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';

let mongo: any;
//connect to MongoMemoryServer
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
// clear collection in the db
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});
//close connection
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// to add a property of a type definition
//==> in the global space find Express,
declare global {
  namespace NodeJS {
    interface Global {
      // add the property (optional ? in this case)
      signin(): Promise<string[]>;
    }
  }
}

//only available in test since it'S in the setup.ts file
//-- see package.json "setupFilesAfterEnv"
global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201);
  const cookie = response.get('Set-Cookie');
  return cookie;
};
