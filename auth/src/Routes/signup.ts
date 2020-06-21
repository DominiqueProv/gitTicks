import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError, validateRequest } from '@dptickets/common';
import { User } from '../Models/user';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    //middleware express-validatior on the body ... see documentation
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      //remove space
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 8 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email in use');
    }
    const user = User.build({ email, password });
    await user.save();

    //generate jwt
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      //the [!] tells typescript that the check is made and that we good to go, removes the warning
      process.env.JWT_KEY!
    );
    //store it on session object
    req.session!.jwt! = userJwt;
    res.status(201).send(user);
  }
);

//rename the router
export { router as signupRouter };
