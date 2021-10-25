import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import useSWR from 'swr'
import moment from 'moment'
import classNames from 'classnames'

import {Post, Comment} from '../../../../utils/types'
import Sidebar from '../../../../components/sub/Sidebar'
import Axios from 'axios'
import {useAuthState} from '../../../../context/auth'
import ActionButton from '../../../../components/ActionButton'
import api from '../../../../utils/api-endpoints'
import {FormEvent, useState} from "react";

export default function PostPage() {
    // Local state
    const [newComment, setNewComment] = useState('')
    // Global state
    const {authenticated, currentUser}: any = useAuthState()

    // Utils
    const router = useRouter()
    const {identifier, sub, slug} = router.query

    const {
        data: post,
        error: postError,
        mutate: postMutate
    }: any = useSWR<Post>(identifier && slug ? `${api.posts}/${identifier}/${slug}` : null)

    const {
        data: comments,
        error: commentsError,
        mutate: commentsMutate
    }: any = useSWR<Comment[]>(identifier && slug ? `${api.posts}/${identifier}/${slug}/comments` : null)

    const postUrl = `/r/${post?.subName}/${post?.identifier}/${post?.slug}`;

    if (postError) console.log(postError)
    if (commentsError) console.log(commentsError)

    const vote = async (value: number, comment?: Comment) => {
        // If not logged in go to login
        if (!authenticated) await router.push('/auth/login')

        // If vote is the same reset vote
        if (
            (!comment && value === post.userVote) ||
            (comment && comment.userVote === value)
        )
            value = 0

        try {
            const res = await Axios.post(api.votes, {
                identifier,
                slug,
                commentIdentifier: comment?.identifier,
                value,
            })

            if (comment) await commentsMutate()
            else await postMutate()
            console.log(res)
        } catch (err) {
            console.log(err)
        }
    }

    const submitComment = async (event: FormEvent) => {
        event.preventDefault()
        if (newComment.trim() === '') return

        try {
            await Axios.post(`${api.posts}/${post.identifier}/${post.slug}/comments`, {
                body: newComment,
            })

            setNewComment('')

            await commentsMutate()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <Head>
                <meta name="description" content={post?.description}/>
                <meta property="twitter:description" content={post?.description}/>
                <meta property="og:description" content={post?.description}/>
                <meta property="og:title" content={post?.title}/>
                <meta property="twitter:title" content={post?.title}/>
                <title>{post?.title}</title>
            </Head>
            <Link href={`/r/${sub}`}>
                <a>
                    <div className="flex items-center w-full h-20 p-8 bg-blue-500">
                        <div className="container flex justify-center">
                            {post && (
                                <div className="w-8 h-8 mr-2 overflow-hidden rounded-full">
                                    {post.sub && <img
                                        src={post.sub.imageUrl}
                                        height={(8 * 16) / 4}
                                        width={(8 * 16) / 4}
                                    />}
                                </div>
                            )}
                            <p className="text-xl font-semibold text-white">/r/{sub}</p>
                        </div>
                    </div>
                </a>
            </Link>
            <div className="container flex pt-5 justify-center">
                {/* Post */}
                <div className="w-160">
                    <div className="bg-white rounded">
                        {post && (
                            <>
                                <div className="flex">
                                    {/* Vote section */}
                                    <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                                        {/* Upvote */}
                                        <div
                                            className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                                            onClick={() => vote(1)}
                                        >
                                            <i
                                                className={classNames('fas fa-arrow-alt-circle-up', {
                                                    'text-red-500': post.userVote === 1,
                                                })}
                                            ></i>
                                        </div>
                                        <p className="text-xs font-bold">{post.voteScore}</p>
                                        {/* Downvote */}
                                        <div
                                            className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                                            onClick={() => vote(-1)}
                                        >
                                            <i
                                                className={classNames('fas fa-arrow-alt-circle-down', {
                                                    'text-blue-600': post.userVote === -1,
                                                })}
                                            ></i>
                                        </div>
                                    </div>
                                    <div className="py-2 pr-2">
                                        <div className="flex items-center">
                                            <p className="text-xs text-gray-500">
                                                Posted by
                                                <Link href={`/u/${post.username}`}>
                                                    <a className="mx-1 hover:underline">
                                                        /u/{post.username}
                                                    </a>
                                                </Link>
                                                <Link href={postUrl}>
                                                    <a className="mx-1 hover:underline">
                                                        {moment(post.createdAt).fromNow()}
                                                    </a>
                                                </Link>
                                            </p>
                                        </div>
                                        {/* Post title */}
                                        <h1 className="my-1 text-xl font-medium">{post.title}</h1>
                                        {/* Post body */}
                                        <p className="my-3 text-sm">{post.body}</p>
                                        {/* Actions */}
                                        <div className="flex">
                                            <Link href={postUrl}>
                                                <a>
                                                    <ActionButton>
                                                        <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                                                        <span className="font-bold">
                              {post.commentCount} Comments
                            </span>
                                                    </ActionButton>
                                                </a>
                                            </Link>
                                            <ActionButton>
                                                <i className="mr-1 fas fa-share fa-xs"></i>
                                                <span className="font-bold">Share</span>
                                            </ActionButton>
                                            <ActionButton>
                                                <i className="mr-1 fas fa-bookmark fa-xs"></i>
                                                <span className="font-bold">Save</span>
                                            </ActionButton>
                                        </div>
                                    </div>
                                </div>
                                {/* Comment input area */}
                                <div className="pl-10 pr-6 mb-4">
                                    {authenticated ? (
                                        <div>
                                            <p className="mb-1 text-xs">
                                                Comment as{' '}
                                                <Link href={`/u/${currentUser.username}`}>
                                                    <a className="font-semibold text-blue-500">
                                                        {currentUser.username}
                                                    </a>
                                                </Link>
                                            </p>
                                            <form onSubmit={submitComment}>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                            onChange={(e) => setNewComment(e.target.value)}
                            value={newComment}
                        ></textarea>
                                                <div className="flex justify-end">
                                                    <button
                                                        className="px-3 py-1 blue button"
                                                        disabled={newComment.trim() === ''}
                                                    >
                                                        Comment
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center justify-between px-2 py-4 border border-gray-200 rounded">
                                            <p className="font-semibold text-gray-400">
                                                Log in or sign up to leave a comment
                                            </p>
                                            <div>
                                                <Link href="/auth/login">
                                                    <a className="px-4 py-1 mr-4 hollow blue button">
                                                        Login
                                                    </a>
                                                </Link>
                                                <Link href="/auth/signup">
                                                    <a className="px-4 py-1 blue button">Sign Up</a>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <hr/>
                                {/* Comments feed */}
                                {comments?.map((comment) => (
                                    <div className="flex" key={comment.identifier}>
                                        {/* Vote section */}
                                        <div className="flex-shrink-0 w-10 py-2 text-center rounded-l">
                                            {/* Upvote */}
                                            <div
                                                className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                                                onClick={() => vote(1, comment)}
                                            >
                                                <i
                                                    className={classNames('fas fa-arrow-alt-circle-up', {
                                                        'text-red-500': comment.userVote === 1,
                                                    })}
                                                ></i>
                                            </div>
                                            <p className="text-xs font-bold">{comment.voteScore}</p>
                                            {/* Downvote */}
                                            <div
                                                className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-blue-600"
                                                onClick={() => vote(-1, comment)}
                                            >
                                                <i
                                                    className={classNames('fas fa-arrow-alt-circle-down', {
                                                        'text-blue-600': comment.userVote === -1,
                                                    })}
                                                ></i>
                                            </div>
                                        </div>
                                        <div className="py-2 pr-2">
                                            <p className="mb-1 text-xs leading-none">
                                                <Link href={`/u/${comment.username}`}>
                                                    <a className="mr-1 font-bold hover:underline">
                                                        {comment.username}
                                                    </a>
                                                </Link>
                                                <span className="text-gray-600">
                          {`
                            ${comment.voteScore}
                            points •
                            ${moment(comment.createdAt).fromNow()}
                          `}
                        </span>
                                            </p>
                                            <p>{comment.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
                {/* Sidebar */}
                {post && <Sidebar sub={post.sub}/>}
            </div>
        </>
    )
}