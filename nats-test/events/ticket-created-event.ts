import { Subjects } from './subjects';

// interface linked with the enum to make sure the data in the msg are known properties
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
