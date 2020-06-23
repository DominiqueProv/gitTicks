import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/Listener/ticket-created-listener';
import { TicketUpdatedListener } from './events/Listener/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/Listener/expiration-complete-listener';
import { PaymentCreatedListener } from './events/Listener/payment-created-listener';

const start = async () => {
  console.log('serveur start...');

  //check if the key exist, if not will throw an error
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    // 1 arg - clisterId: look in the nats-depl.yaml for -cid (clusterId)
    // 2 arg - clientid: more less random value
    // 3 arg - url: service governing access to our nats depl. (nats-srv port 4222)
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

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
