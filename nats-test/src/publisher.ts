import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from '../events/ticket-created-publisher';
console.clear();

//use nats library to create a client connect to our Nats streaming server
//"stan" in the nats world it a client, nats = stan reverse
//second argument 'abc' is client id
const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Published connected to NATS');

  const publisher = new TicketCreatedPublisher(stan);
  try {
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }
});
