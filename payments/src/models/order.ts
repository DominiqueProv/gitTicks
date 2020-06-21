import mongoose from 'mongoose';
import { OrderStatus } from '@dptickets/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus };

// list of properties to create an order
interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

// list of properties an order has
// no need to include the id, the mongoose.Document we extend already include the id
interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  status: OrderStatus;
  price: number;
}

// list of properties the model itself contain
interface OrderModel extends mongoose.Model<OrderDoc> {
  // build method takes an object OrderAttrs and return an instance of type OrderDoc
  build(attrs: OrderAttrs): OrderDoc;
}

// no version needed in the schema,
// 'updateIfCurrent' module will maintain the version automagicly
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      //ret = return value
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

//versioning with plugin
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};
const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
