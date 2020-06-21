import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@dptickets/common';
import { body } from 'express-validator';
import { Ticket } from '../Models/tickets';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    await ticket.save();
    //publish event after saving to inService-db

    //importing the "get method from natsWrapper then publish the event"
    new TicketCreatedPublisher(natsWrapper.client).publish({
      //need to extract data from ticket, cannot just pass 'title' attibute
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
