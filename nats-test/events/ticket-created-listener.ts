// pull "Message from the library to tell typescript what to expect for the argument passed in the subscription"
import { Message } from 'node-nats-streaming';
import { Listener } from '../events/base-listener';
import { TicketCreatedEvent } from '../events/ticket-created-event';
import { Subjects } from '../events/subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  //only goes to only one instances
  queueGroupName = 'payment-service';
  onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    msg.ack();
  }
}
