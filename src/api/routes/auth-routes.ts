import {Router} from 'express';
import UsersController from "../controllers/users-controller";
import validator from "../validators/users-validator";
import checkAuth from "../middlware/check-auth";

//router instance
const router = Router();

//users routes
router.post('/signup', validator.signup(), UsersController.signup);

router.post('/login', validator.login(), UsersController.login);

router.get('/me', checkAuth, UsersController.me);

router.get('/logout', checkAuth, UsersController.logout);

export default router;