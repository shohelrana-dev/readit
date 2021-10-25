import {Router} from 'express';
import UsersController from "../controllers/users-controller";

//router instance
const router = Router();

//users routes
router.get('/:username', UsersController.getUserSubmissions);

export default router;