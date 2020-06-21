import { Ticket } from '../tickets';
import { app } from '../../app';
import request from 'supertest';

it('implement a version optimistic concurrency control', async (done) => {
  // Create an instance to a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '234',
  });

  //Save the ticket to the db
  await ticket.save();
  //fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //make two separate changes to the ticket fetched

  firstInstance!.set({ price: 1000 });
  firstInstance!.set({ price: 2000 });
  // save the first fetched ticket

  await firstInstance!.save();

  // save the second fetched ticket an expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    // "done" method is in the Jest library, passed it as argument 'callabck funtion' and return it to make sure
    // it's done with the test
    return done();
  }
  throw new Error('Should not reach this point');
});

it('increment the version number on mutliple save', async () => {
  const ticket = Ticket.build({
    title: 'wfj',
    price: 39,
    userId: 'wkj',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
