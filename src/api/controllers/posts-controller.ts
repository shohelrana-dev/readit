import {Request, Response} from "express";
import {validationResult} from "express-validator";
import Post from "../entities/Post";
import Sub from "../entities/Sub";
import Comment from "../entities/Comment";

class PostsController {

    public async getPosts(req: Request, res: Response): Promise<Response> {
        const currentPage = (req.query.page || 0) as number;
        const postsPerPage = (req.query.count || 8) as number;
        try {
            const posts = await Post.find({
                relations: ['votes', 'sub'],
                order: {createdAt: 'DESC'},
                skip: currentPage * postsPerPage,
                take: postsPerPage
            });

            if (res.locals.currentUser) {
                posts.forEach((post) => {
                    post.setUserVote(res.locals.currentUser)
                })
            }

            posts.forEach(post => {
                post.sub.setImageUrl()
            })

            return res.json(posts);
        } catch (err) {
            console.log(err.message);
            return res.status(500).json({
                error: true,
                message: 'Something went wrong!'
            });
        }
    }

    public async getPost(req: Request, res: Response): Promise<Response> {
        const {identifier, slug} = req.params;
        try {
            const post = await Post.findOneOrFail({identifier, slug}, {
                relations: ['sub', 'votes']
            })

            if (res.locals.currentUser) {
                post.setUserVote(res.locals.currentUser);
            }

            post.sub.setImageUrl()

            return res.json(post);
        } catch (err) {
            console.log(err.message);
            return res.status(404).json({
                error: true,
                message: 'Post not found!'
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
        const user = res.locals.user;

        try {
            const subRecord = await Sub.findOneOrFail({name: sub});

            const post = Post.create({title, body, user, subName: sub, sub: subRecord});
            await post.save();

            //return success response
            return res.status(201).json({
                success: true,
                message: 'Post created successfully',
                post: post
            });
        } catch (err) {
            console.log(err.message)
            return res.status(500).json({
                error: true,
                message: 'Something went wrong!'
            });
        }
    }

    public async commentOnPost(req: Request, res: Response) {
        const {identifier, slug} = req.params

        try {
            const post = await Post.findOneOrFail({identifier, slug})

            const comment = new Comment({
                body: req.body.body,
                user: res.locals.user,
                post,
            });

            await comment.save();

            return res.json({
                success: true,
                message: "Comment saved successfully",
                comment
            })
        } catch (err) {
            console.log(err.message)
            return res.status(404).json({error: 'Post not found'})
        }
    }

    public async getPostComments(req: Request, res: Response) {
        const {identifier, slug} = req.params
        try {
            const post = await Post.findOneOrFail({identifier, slug})

            const comments = await Comment.find({
                where: {post},
                order: {createdAt: 'DESC'},
                relations: ['votes'],
            })

            comments.forEach(c => {
                c.setVoteScore()
            })

            if (res.locals.currentUser) {
                comments.forEach((c) => c.setUserVote(res.locals.currentUser))
            }

            return res.json(comments)
        } catch (err) {
            console.log(err)
            return res.status(500).json({error: 'Something went wrong'})
        }
    }
}

export default new PostsController;