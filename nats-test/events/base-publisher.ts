import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T['data']): Promise<void> {
    // create a promise manually
    return new Promise((resolve, reject) => {
      // Nats like local storage only talks with JSON files
      // first argument 'name of chanel"
      // second argument to publish, data
      // third (optional) callback function when the event is finished publishing
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log('Event published to subject', this.subject);
        resolve();
      });
    });
  }
}
//in the world of nats, events are refered as "Messages" in the documentation
