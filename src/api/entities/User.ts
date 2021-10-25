import {Entity, Column, OneToMany} from "typeorm";
import BaseEntity from "./BaseEntity";
import Post from "./Post";
import Vote from "./Vote";

@Entity('users')
class User extends BaseEntity{

    @Column({ unique: true })
    username: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @OneToMany(()=> Post, post=> post.user)
    posts: Post[]

    @OneToMany(() => Vote, (vote: Vote) => vote.user)
    votes: Vote[]

    constructor(user: Partial<User>) {
        super();
        Object.assign(this, user);
    }
}

export default User;
