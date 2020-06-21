import {
  Subjects,
  PaymentCreatedEvent,
  Listener,
  OrderStatus,
} from '@dptickets/common';
import { queueGroupName } from '../Listener/queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../Models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = data;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Not order found');
    }
    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
