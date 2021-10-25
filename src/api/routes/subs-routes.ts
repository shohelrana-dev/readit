import {Router} from 'express';
import checkAuth from "../middlware/check-auth";
import SubsController from "../controllers/subs-controller";
import validator from "../validators/subs-validator";

//router instance
const router = Router();

//subs routes
router.post('/', checkAuth, validator.create(), SubsController.create);

router.get('/top-subs', SubsController.topSubs);

router.get('/:name', SubsController.getSub);

router.post('/:name/image', checkAuth, SubsController.uploadSubImage);

router.get('/search/:name', SubsController.searchSubs)

export default router;