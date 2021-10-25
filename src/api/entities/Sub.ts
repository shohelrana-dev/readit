import {Entity, Column, ManyToOne, JoinColumn, OneToMany} from "typeorm";
import BaseEntity from "./BaseEntity";
import User from "./User";
import Post from "./Post";

@Entity('subs')
class Sub extends BaseEntity {

    @Column({unique: true})
    public name: string

    @Column()
    public title: string

    @Column({type: 'text'})
    public description: string

    @Column({nullable: true})
    public imageUrn: string

    @Column({nullable: true})
    public bannerUrn: string

    @Column()
    public username: string

    @ManyToOne(() => User)
    @JoinColumn({name: 'username', referencedColumnName: 'username'})
    public user: User

    @OneToMany(() => Post, (post) => post.sub)
    public posts: Post[]

    constructor(sub: Partial<Sub>) {
        super();
        Object.assign(this, sub);
    }

    public imageUrl: string

    public setImageUrl(): void {
        this.imageUrl = this.imageUrn
            ? `${process.env.APP_URL}/images/${this.imageUrn}`
            : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
    }

    public bannerUrl: string | undefined

    public setBannerUrl(): void {
        this.bannerUrl = this.bannerUrn
            ? `${process.env.APP_URL}/images/${this.bannerUrn}`
            : undefined
    }
}

export default Sub;
