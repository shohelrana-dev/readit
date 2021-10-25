export interface Post {
    identifier: string
    title: string
    body?: string
    slug: string
    subName: string
    sub?: Sub
    username: string
    createdAt: string
    updatedAt: string
    // Virtual fields
    url: string
    voteScore?: number
    commentCount?: number
    userVote?: number
}

export interface User {
    id: number
    username: string
    email: string
}

export interface Sub {
    createdAt: string
    updatedAt: string
    name: string
    title: string
    description: string
    imageUrn: string
    bannerUrn: string
    username: string
    posts: Post[]
    // Virtuals
    imageUrl: string
    bannerUrl: string
    postCount?: number
}

export interface Comment {
    identifier: string
    body: string
    username: string
    createdAt: string
    updatedAt: string
    post?: Post
    // Virtuals
    userVote: number
    voteScore: number
}