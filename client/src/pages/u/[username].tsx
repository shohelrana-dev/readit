import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import useSWR from 'swr'
import PostCard from '../../components/home/PostCard'
import {Post, Comment} from '../../utils/types'
import api from '../../utils/api-endpoints'
import {GetServerSideProps} from "next";
import axios from "axios";

export default function user() {
    const router = useRouter()
    const username = router.query.username

    const {data, error, mutate} = useSWR<any>(username ? `${api.users}/${username}` : null)
    if (error) console.log(error)

    if (data) console.log(data)

    return (
        <>
            <Head>
                <title>{data?.user.username}</title>
            </Head>
            {data && (
                <div className="container flex pt-5 justify-center">
                    <div className="w-160">
                        {data.submissions.map((submission: any) => {
                            if (submission.type === 'Post') {
                                const post: Post = submission
                                return <PostCard key={post.identifier} post={post} mutate={mutate}/>
                            } else {
                                const comment: Comment = submission
                                const postUrl = `/r/${comment.post?.subName}/${comment.post?.identifier}/${comment.post?.slug}`
                                return (
                                    <div
                                        key={comment.identifier}
                                        className="flex my-4 bg-white rounded"
                                    >
                                        <div className="flex-shrink-0 w-10 py-4 text-center bg-gray-200 rounded-l">
                                            <i className="text-gray-500 fas fa-comment-alt fa-xs"></i>
                                        </div>
                                        <div className="w-full p-2">
                                            <p className="mb-2 text-xs text-gray-500">
                                                {comment.username}

                                                <span> commented on </span>
                                                <Link href={postUrl}>
                                                    <a className="font-semibold cursor-pointer hover:underline">
                                                        {comment.post.title}
                                                    </a>
                                                </Link>
                                                <span className="mx-1">•</span>
                                                <Link href={`/r/${comment.post.subName}`}>
                                                    <a className="text-black cursor-pointer hover:underline">
                                                        /r/{comment.post.subName}
                                                    </a>
                                                </Link>
                                            </p>
                                            <hr/>
                                            <p>{comment.body}</p>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>
                    <div className="ml-6 w-80">
                        <div className="bg-white rounded">
                            <div className="p-3 bg-blue-500 rounded-t">
                                <img
                                    src="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                                    alt="user profile"
                                    className="w-16 h-16 mx-auto border-2 border-white rounded-full"
                                />
                            </div>
                            <div className="p-3 text-center">
                                <h1 className="mb-3 text-xl">{data.user.username}</h1>
                                <hr/>
                                <p className="mt-3">
                                    Joined {moment(data.user.createdAt).format('MMM YYYY')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, res}) => {
    try {
        const cookie = req.headers.cookie
        if (!cookie) throw new Error('Missing auth token cookie')

        await axios.get(api.me, {headers: {cookie}})

        return {props: {}}
    } catch (err) {
        res.writeHead(307, {Location: '/auth/login'}).end()
    }
}