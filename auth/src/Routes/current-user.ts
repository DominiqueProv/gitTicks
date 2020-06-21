import express from 'express';
import { currentUser } from '@dptickets/common';
const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

//rename the router
export { router as currentUserRouter };
