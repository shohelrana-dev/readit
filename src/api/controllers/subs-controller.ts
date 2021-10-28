import {Request, Response} from "express";
import {validationResult} from "express-validator";
import Sub from "../entities/Sub";
import User from "../entities/User";
import Post from "../entities/Post";
import path from 'path'
import fs from "fs";
import {getConnection, getRepository} from "typeorm";

class SubsController {

    public create = async (req: Request, res: Response): Promise<Response> => {
        //check errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.mapped()});
        }

        const {name, title, description} = req.body;
        const user: User = res.locals.user;

        try {
            const sub = Sub.create({name, title, description, user});
            await sub.save();

            //return success response
            return res.status(201).json({
                success: true,
                message: 'Sub created successfully',
                sub
            });
        } catch (err) {
            console.log(err.message)
            return res.status(500).json({
                success: false,
                message: 'Something went wrong!'
            });
        }
    }

    public getSub = async (req: Request, res: Response): Promise<Response> => {
        try {
            const {name} = req.params;

            const sub = await Sub.findOneOrFail({name});
            sub.setImageUrl();
            sub.setBannerUrl();

            const posts = await Post.find({
                where: {sub},
                order: {createdAt: 'DESC'},
                relations: ['comments', 'votes']
            });

            if (res.locals.currentUser) {
                posts.forEach((post) => {
                    post.setUserVote(res.locals.currentUser)
                })
            }

            sub.posts = posts;

            return res.json(sub);
        } catch (err) {
            console.log(err.message)
            return res.status(500).json({
                success: false,
                message: 'Something went wrong!'
            });
        }
    }

    public uploadSubImage = async (req: Request, res: Response): Promise<Response> => {
        try {
            // @ts-ignore
            const file: any = req.files.file;
            const type = req.body.type;
            const sub: Sub = await Sub.findOneOrFail({name: req.params.name});

            //check own sub
            if (sub.username !== res.locals.currentUser.username) {
                return res.status(403).json({
                    success: false,
                    message: 'You dont own this sub'
                })
            }


            //check file type
            if (type !== 'image' && type !== 'banner') {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file type'
                });
            }

            //save image
            let oldFileName: string = '';
            let filename: string = Date.now() + path.extname(file.name);
            if (type === 'image') {
                oldFileName = sub.imageUrn;
                sub.imageUrn = filename;
            } else if (type === 'banner') {
                oldFileName = sub.bannerUrn;
                sub.bannerUrn = filename;
            }

            //upload file
            this.upload(file, filename, oldFileName);

            await sub.save()

            return res.json(sub)
        } catch (err) {
            console.log(err)
            return res.status(500).json({
                success: false,
                message: 'Something went wrong'
            })
        }
    }

    private upload(file: any, filename: string, oldFileName: string): void {
        let uploadDir: string = path.join(__dirname, '/../../../public/images/');

        file.mv(uploadDir + filename, (err: any) => {
            if (!err) {
                //delete old file
                if (oldFileName) {
                    let fullFilePath = uploadDir + oldFileName;
                    fs.unlink(fullFilePath, err => {
                        if (err) console.log(err)
                    });
                }
            }
        })
    }

    public topSubs = async (_: Request, res: Response): Promise<Response> => {
        try {
            /**
             * SELECT s.title, s.name,
             * COALESCE('http://localhost:5000/images/' || s."imageUrn" , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y') as imageUrl,
             * count(p.id) as "postCount"
             * FROM subs s
             * LEFT JOIN posts p ON s.name = p."subName"
             * GROUP BY s.title, s.name, imageUrl
             * ORDER BY "postCount" DESC
             * LIMIT 5;
             */
            const imageUrlExp = `COALESCE('${process.env.APP_URL}/images/' || s.imageUrn , 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`
            const subs = await getConnection()
                .createQueryBuilder()
                .select(
                    `s.title, s.name, ${imageUrlExp} as imageUrl, count(p.id) as postCount`
                )
                .from(Sub, 's')
                .leftJoin(Post, 'p', `s.name = p.subName`)
                .groupBy('s.title, s.name, imageUrl')
                .orderBy(`"postCount"`, 'DESC')
                .limit(5)
                .execute()

            return res.json(subs)
        } catch (err) {
            console.log(err.message)
            return res.status(500).json({error: 'Something went wrong'})
        }
    }

    public searchSubs = async (req: Request, res: Response): Promise<Response> => {
        try {
            const name = req.params.name

            if (name.trim() === '') {
                return res.status(400).json({error: 'Name must not be empty'})
            }

            // reactJS , reactjs
            const subs = await getRepository(Sub)
                .createQueryBuilder()
                // react => rea
                .where('LOWER(name) LIKE :name', {
                    name: `${name.toLowerCase().trim()}%`,
                })
                .getMany()

            return res.json(subs)
        } catch (err) {
            console.log(err)
            return res.status(500).json({error: 'Something went wrong'})
        }
    }
}

export default new SubsController;