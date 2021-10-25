import React, {Fragment} from 'react';
import Link from "next/link";
import moment from "moment";
import {Post} from "../../utils/types";
import classNames from "classnames";
import axios from "axios";
import api from "../../utils/api-endpoints";
import {useRouter} from "next/router";
import {useAuthState} from "../../context/auth";

interface PostProps {
    post: Post
    mutate: Function
}

const PostCard: React.FC<PostProps> = ({post, mutate}) => {

    post.url = `/r/${post.subName}/${post.identifier}/${post.slug}`;

    const router = useRouter();
    const {authenticated} = useAuthState();

    const isInSubPage = router.pathname === '/r/[sub]' //r/[sub]

    const vote = async (value: number) => {
        if (!authenticated) await router.push('/auth/login')
        try {
            const res = await axios.post(api.votes, {
                identifier: post.identifier,
                slug: post.slug,
                value,
            })
            await mutate()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div key={post.identifier} className="flex mb-4 bg-white rounded" id={post.identifier}>

            {/* Vote section */}
            <div className="w-10 py-3 text-center bg-gray-200 rounded-l">
                {/* Upvote */}
                <div
                    className="w-6 mx-auto text-gray-400 rounded cursor-pointer hover:bg-gray-300 hover:text-red-500"
                    onClick={() => vote(1)}
                >
                    <i
                        className={classNames('fas fa-arrow-alt-circle-up', {
                            'text-red-500': post.userVote === 1,
                        })}
                    >
                    </i>
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
                    >
                    </i>
                </div>
            </div>

            {/* Post data section */}
            <div className="w-full p-2">
                <div className="flex items-center">
                    {!isInSubPage && (<>
                        <Link href={`${post.subName}`}>
                            <img
                                src={post?.sub?.imageUrl}
                                className="w-6 h-6 mr-1 rounded-full cursor-pointer"
                            />
                        </Link>
                        <Link href={`/r/${post.subName}`}>
                            <a className="text-xs font-bold cursor-pointer hover:underline">
                                /r/{post.subName}
                            </a>
                        </Link>
                    </>)}
                    <p className="text-xs text-gray-500">
                        <span className="mx-1">•</span>
                        Posted by
                        <Link href={`/u/${post.username}`}>
                            <a className="mx-1 hover:underline">/u/{post.username}</a>
                        </Link>
                        <Link href={post.url}>
                            <a className="mx-1 hover:underline">
                                {moment(post.createdAt).fromNow()}
                            </a>
                        </Link>
                    </p>
                </div>
                <Link href={post.url}>
                    <a className="my-1 text-lg font-medium">{post.title}</a>
                </Link>
                {post.body && <p className="my-1 text-sm">{post.body}</p>}

                <div className="flex">
                    <Link href={post.url}>
                        <a>
                            <div
                                className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                                <i className="mr-1 fas fa-comment-alt fa-xs"></i>
                                <span className="font-bold">20 Comments</span>
                            </div>
                        </a>
                    </Link>
                    <div
                        className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-share fa-xs"></i>
                        <span className="font-bold">Share</span>
                    </div>
                    <div
                        className="px-1 py-1 mr-1 text-xs text-gray-400 rounded cursor-pointer hover:bg-gray-200">
                        <i className="mr-1 fas fa-bookmark fa-xs"></i>
                        <span className="font-bold">Save</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostCard;
