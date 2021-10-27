import {Router} from 'express';
import UsersController from "../controllers/users-controller";
import validation from "../validations/users-validation";
import checkAuth from "../middlware/check-auth";

//router instance
const router = Router();

//users routes
router.post('/signup', validation.signup(), UsersController.signup);

router.post('/login', validation.login(), UsersController.login);

router.get('/me', checkAuth, UsersController.me);

router.get('/logout', checkAuth, UsersController.logout);

export default router;