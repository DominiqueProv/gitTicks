import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@dptickets/common';
import { Ticket } from '../../Models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // Define Subject property
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  // queuegroupname make sure the event is only send to one of the subcriber of that chanel
  queueGroupName = queueGroupName;
  // first arg, data from the event. second arg is from the library to access method ack
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      title,
      price,
      id,
    });
    await ticket.save();
    //call when successfully process the event
    msg.ack();
  }
}
