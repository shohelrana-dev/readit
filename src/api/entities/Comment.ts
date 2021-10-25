import {Entity, Column, ManyToOne, JoinColumn, BeforeInsert, OneToMany} from "typeorm";
import BaseEntity from "./BaseEntity";
import User from "./User";
import Post from "./Post";
import {makeId} from "../utils/helpers";
import Vote from "./Vote";

@Entity('comments')
class Comment extends BaseEntity {

    @Column()
    identifier: string

    @Column()
    body: string

    @Column()
    username: string

    @ManyToOne(() => User)
    @JoinColumn({name: 'username', referencedColumnName: 'username'})
    user: User

    @ManyToOne(() => Post, (post) => post.comments, {nullable: false})
    post: Post

    @OneToMany(() => Vote, (vote: Vote) => vote.comment)
    votes: Vote[]

    constructor(comment: Partial<Comment>) {
        super()
        Object.assign(this, comment)
    }

    voteScore: number

    setVoteScore() {
        this.voteScore = this.votes?.reduce((prev, curr) => prev + (curr.value || 0), 0)
    }

    protected userVote: number

    setUserVote(user: User) {
        const index = this.votes?.findIndex((v) => v.username === user.username)
        this.userVote = index > -1 ? this.votes[index].value : 0
    }

    @BeforeInsert()
    makeIdAndSlug() {
        this.identifier = makeId(8)
    }
}

export default Comment;
