import { Listener, OrderCreatedEvent, Subjects } from '@dptickets/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../Models/tickets';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;
  // first arg, data from the event. second arg is from the library to access method ack
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);
    // If no ticket throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }
    // Mark ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    //Publish event from a listener
    //add await make sure that if there's an error durring the publishing it will be thrown and wont reach the ack
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });
    // ack the message
    msg.ack();
  }
}
