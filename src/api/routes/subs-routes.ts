import {Router} from 'express';
import checkAuth from "../middlware/check-auth";
import SubsController from "../controllers/subs-controller";
import validation from "../validations/subs-validation";

//router instance
const router = Router();

//subs routes
router.post('/', checkAuth, validation.create(), SubsController.create);

router.get('/top-subs', SubsController.topSubs);

router.get('/:name', SubsController.getSub);

router.post('/:name/image', checkAuth, SubsController.uploadSubImage);

router.get('/search/:name', SubsController.searchSubs)

export default router;