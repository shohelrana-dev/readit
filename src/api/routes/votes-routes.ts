import {Router} from 'express';
import VotesController from '../controllers/votes-controller';
import checkAuth from '../middlware/check-auth';

//router instance
const router = Router();

//subs routes
router.post('/', checkAuth, VotesController.create);

export default router;