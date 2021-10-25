import {Entity, Column, ManyToOne, JoinColumn, BeforeInsert, OneToMany} from "typeorm";
import BaseEntity from "./BaseEntity";
import User from "./User";
import {makeId} from "../utils/helpers";
import slugify from "slugify";
import Sub from "./Sub";
import Comment from "./Comment";
import Vote from "./Vote";

@Entity('posts')
class Post extends BaseEntity {

    @Column({unique: true})
    identifier: string //7 character id

    @Column()
    title: string

    @Column()
    slug: string

    @Column({nullable: true, type: 'text'})
    body: string

    @Column()
    subName: string

    @Column()
    username: string

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({ name: 'username', referencedColumnName: 'username' })
    user: User

    @ManyToOne(() => Sub, (sub) => sub.posts)
    @JoinColumn({ name: 'subName', referencedColumnName: 'name' })
    sub: Sub

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[]

    @OneToMany(() => Vote, (vote: Vote) => vote.post)
    votes: Vote[]


    constructor(post: Partial<Post>) {
        super();
        Object.assign(this, post);
    }

    public userVote: number
    setUserVote(user: User) {
        const index = this.votes?.findIndex((vote) => vote.username === user.username)
        this.userVote = index > -1 ? this.votes[index].value : 0
        this.totalVoteScore();
    }

    public voteScore: number
    totalVoteScore() {
        this.voteScore = this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0)
    }

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(7);
        this.slug = slugify(this.title, {
            replacement: '_',
            lower: true,
        });
    }
}

export default Post;
