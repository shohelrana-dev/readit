import {Request, Response} from "express";
import bcrypt from "bcrypt";
import User from "../entities/User";
import {validationResult} from "express-validator";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import Comment from "../entities/Comment";
import Post from "../entities/Post";

class UsersController {

    public async signup(req: Request, res: Response): Promise<Response> {
        try {
            let {email, username, password} = req.body;

            //check errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.mapped()});
            }

            //create the user
            password = await bcrypt.hash(password, 6);
            const user = User.create({email, username, password});
            await user.save();

            //return the created user
            return res.status(201).json({
                success: true,
                message: 'User signup successfully',
                user
            });
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                error: true,
                message: 'Something went wrong!'
            });
        }
    }

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            let {username} = req.body;

            //check errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.mapped()});
            }

            //set cookie
            let token = jwt.sign({username}, process.env.JWT_SECRET!);
            res.set('Set-Cookie', cookie.serialize('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600,
                path: '/'
            }))

            //return response
            const user: any = await User.findOne({username});
            return res.status(201).json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            });
        } catch (err) {
            console.log(err.message)
            return res.status(500).json({
                error: true,
                message: 'Something went wrong!'
            });
        }
    }

    public async me(_: Request, res: Response) {
        return res.json(res.locals.user);
    }

    public async logout(_: Request, res: Response) {
        res.set('Set-Cookie', cookie.serialize('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0),
            path: '/'
        }));

        return res.json({success: true, message: 'Logout successfully'});
    }

    public async getUserSubmissions(req: Request, res: Response) {
        try {
            const user = await User.findOneOrFail({
                where: {username: req.params.username},
                select: ['username', 'createdAt'],
            })

            const posts = await Post.find({
                where: {user},
                relations: ['comments', 'votes', 'sub'],
            })

            const comments = await Comment.find({
                where: {user},
                relations: ['post'],
            })

            if (res.locals.currentUser) {
                posts.forEach((p) => p.setUserVote(res.locals.currentUser));
                comments.forEach((c) => c.setUserVote(res.locals.currentUser));
            }

            let submissions: any[] = [];
            posts.forEach((p: any) => {
                console.log(p)
                submissions.push({type: 'Post', ...p})
            });
            comments.forEach((c: any) => {
                submissions.push({type: 'Comment', ...c})
            });

            submissions.sort((a, b) => {
                if (b.createdAt > a.createdAt) return 1
                if (b.createdAt < a.createdAt) return -1
                return 0
            })

            return res.json({user, submissions})
        } catch (err) {
            console.log(err)
            return res.status(500).json({error: 'Something went wrong'})
        }
    }

}

export default new UsersController;