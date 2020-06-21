import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import mongoose from 'mongoose';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payments';
// jest.mock('../../stripe');

it('return a 404 when purchasing an order that doesnt exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'slkfjdwf',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('return a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'slkfjdwf',
      orderId: order.id,
    })
    .expect(401);
});

it('return a 400 when purchasing an order that is already cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'slkfjdwf',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201);

  // test with real StripeAPI

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100;
  });

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('cad');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
  //import stripe mock
  //to get access to the arg the request was made with
  //tell typescript () as jest.Mock to add the type to the method create
  // const chargeOption = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  // console.log(chargeOption);

  // expect(chargeOption.source).toEqual('tok_visa');
  // expect(chargeOption.amount).toEqual(20 * 100);
  // expect(chargeOption.currency).toEqual('cad');
});
