import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from '@dptickets/common';
import mongoose from 'mongoose';
import { Order } from '../../../models/order';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'slhjf',
    expiresAt: 'alkfjdf',
    ticket: {
      id: 'sdlkfjdsf',
      price: 20,
    },
  };
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicate the order info', async () => {
  const { listener, data, msg } = await setup();
  const { id, version, status, userId, expiresAt, ticket } = data;
  await listener.onMessage(data, msg);
  const order = await Order.findById(id);
  expect(order!.price).toEqual(ticket.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
