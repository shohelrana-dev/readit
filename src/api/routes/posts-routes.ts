import {Router} from 'express';
import checkAuth from "../middlware/check-auth";
import PostsController from "../controllers/posts-controller";
import validation from "../validations/posts-validation";


//router instance
const router = Router();

//posts routes
router.post('/', checkAuth, validation.create(), PostsController.create);

router.get('/', PostsController.getPosts);

router.get('/:identifier/:slug', PostsController.getPost);

router.post('/:identifier/:slug/comments', checkAuth, PostsController.commentOnPost);

router.get('/:identifier/:slug/comments', PostsController.getPostComments)

export default router;