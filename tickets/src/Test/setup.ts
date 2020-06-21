import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../nats-wrapper');

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
  jest.clearAllMocks();
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
      signin(): string[];
    }
  }
}

//only available in test since it'S in the setup.ts file
//-- see package.json "setupFilesAfterEnv"
global.signin = () => {
  //Build a JWT payload. {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };
  //Create JWT !
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //Build session object { jwt: MY_JWT}
  const session = { jwt: token };
  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);
  //Take JSON and encode it as a base 64
  const base64 = Buffer.from(sessionJSON).toString('base64');
  //return a string with the encoded data
  return [`express:sess=${base64}`];
};
