import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@dptickets/common';

import { User } from '../Models/user';
import { Password } from '../Services/password';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    //middleware express-validatior on the body ... see documentation
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      //remove space
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credetials');
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credetials');
    }
    //generate jwt
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    //store it on session object
    req.session!.jwt! = userJwt;

    res.status(200).send(existingUser);
  }
);

//rename the router
export { router as signinRouter };
