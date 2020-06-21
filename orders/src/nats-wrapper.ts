import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
  // (?) tell typescript the property might be undefiner for a certain period of time
  // not define in contructor, too early to assing the client,
  // we want to connect in the index.ts after the connection to moongodb is made
  private _client?: Stan;

  //typescripte getter, access nats client tru this propertie
  get client() {
    if (!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }
  // pass 3 args clusterId, clientId, UrltoConnect is an object, plus define the type
  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });
    console.log('Listener connected to NATS');

    return new Promise((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

// export a single instance of the wrapper to share it across the file in the service
// we are running the constructor in the instantiated class exported to index and ticketcreated
//not in this class creation
export const natsWrapper = new NatsWrapper();
