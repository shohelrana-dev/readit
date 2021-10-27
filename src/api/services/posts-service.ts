import Post from "../entities/Post";
import User from "../entities/User";
import Sub from "../entities/Sub";
import Comment from "../entities/Comment";

class PostsService {
    public async getPosts(currentPage: number, postsPerPage: number, currentUser: User) {
        try {
            const posts = await Post.find({
                relations: ['votes', 'sub'],
                order: {createdAt: 'DESC'},
                skip: currentPage * postsPerPage,
                take: postsPerPage
            });

            if (currentUser) {
                posts.forEach((post) => {
                    post.setUserVote(currentUser)
                })
            }

            posts.forEach(post => {
                post.sub.setImageUrl()
            })

            return posts;
        } catch (_) {
            throw new Error('Posts could not found!')
        }
    }

    public async getPost(options: object, currentUser: User) {
        try {
            const post = await Post.findOneOrFail(options, {
                relations: ['sub', 'votes']
            })

            if (currentUser) {
                post.setUserVote(currentUser);
            }

            post.sub.setImageUrl()

            return post;
        } catch (_) {
            throw new Error('Post could not found!')
        }
    }

    public async create(data: { title: string; body: string; sub: string; currentUser: User; }) {
        const {title, body, sub, currentUser} = data;
        try {
            const subRecord = await Sub.findOneOrFail({name: sub});

            const post = Post.create({title, body, user: currentUser, subName: sub, sub: subRecord});
            await post.save()

            return post;
        } catch (_) {
            throw new Error('Post could not be created!')
        }
    }

    public async commentOnPost(postData: { identifier: string; slug: string; }, commentData: { body: string; user: User; }) {
        const {identifier, slug} = postData;
        const {body, user} = commentData;
        try {
            const post = await Post.findOneOrFail({identifier, slug})
            const comment = new Comment({body, user, post});

            await comment.save();

            return comment;
        } catch (err) {
            console.log(err.message)
            throw new Error('Comment could not be saved!')
        }
    }

    public async getPostComments(identifier: string, slug: string, currentUser: User) {

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

            if (currentUser) {
                comments.forEach((c) => c.setUserVote(currentUser))
            }

            return comments;
        } catch (_) {
            throw new Error('Comments could not found!')
        }
    }
}

export default new PostsService();