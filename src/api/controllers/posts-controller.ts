import {Request, Response} from "express";
import {validationResult} from "express-validator";
import PostsService from "../services/posts-service";

class PostsController {

    public async getPosts(req: Request, res: Response): Promise<Response> {
        const currentPage = (req.query.page || 0) as number;
        const postsPerPage = (req.query.count || 8) as number;
        try {
            const posts = await PostsService.getPosts(currentPage, postsPerPage, res.locals.currentUser);

            return res.json(posts);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    public async getPost(req: Request, res: Response): Promise<Response> {
        const {identifier, slug} = req.params;
        try {
            const post = await PostsService.getPost({identifier, slug}, res.locals.currentUser);

            return res.json(post);
        } catch (err) {
            return res.status(404).json({
                success: false,
                message: err.message
            });
        }
    }

    public async create(req: Request, res: Response): Promise<Response> {
        //check errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.mapped()});
        }

        const {title, body, sub} = req.body;

        try {
            const post = await PostsService.create({title, body, sub, currentUser: res.locals.currentUser});

            //return success response
            return res.status(201).json({
                success: true,
                message: 'Post created successfully',
                post: post
            });
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }
    }

    public async commentOnPost(req: Request, res: Response): Promise<Response> {
        const {identifier, slug} = req.params;
        const {body} = req.body;
        const user = res.locals.currentUser;

        try {
            const comment = await PostsService.commentOnPost({identifier, slug}, {body, user});

            return res.json({
                success: true,
                message: "Comment saved successfully",
                comment
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }

    public async getPostComments(req: Request, res: Response): Promise<Response> {
        const {identifier, slug} = req.params
        try {
            const comments = await PostsService.getPostComments(identifier, slug, res.locals.currentUser);

            return res.json(comments)
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            })
        }
    }
}

export default new PostsController;