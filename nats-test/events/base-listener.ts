// pull "Message from the library to tell typescript what to expect for the argument passed in the subscription"
import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  //asbract must be defined in a sub-class
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;
  //private ???
  private client: Stan;
  //protected ??
  protected ackWait = 5 * 1000;

  // receive a client to use in the class - constructor is the argument to pass in the subclass "new nameoftheClass(stan)"
  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOption() {
    //first argument of the subscribe is the name of the chanel,
    //second arg is the name of the queue group inside the chanel
    //third arg would be const option = stan.chained from subscriptionOptions().someMethod().someOtherMethod() passed as "option"
    //setDeliverAllAvailable, setDurableNAme and name of the queue group work togheter always
    return (
      this.client
        .subscriptionOptions()
        // get all event of the past
        .setDeliverAllAvailable()
        .setManualAckMode(true)
        .setAckWait(this.ackWait)
        //keep track of event gone thu
        .setDurableName(this.queueGroupName)
    );
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOption()
    );

    subscription.on('message', (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
      const parseData = this.parseMessage(msg);
      this.onMessage(parseData, msg);
    });
  }
  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8')); //last bit to parse a Buffer
  }
}
