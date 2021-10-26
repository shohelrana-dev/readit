import {NextPage} from 'next'
import Link from 'next/link'
import Head from 'next/head'
import PostCard from "../components/home/PostCard"
import {Post, Sub} from "../utils/types"
import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import api from '../utils/api-endpoints'
import {useEffect, useState} from "react"

const Home: NextPage = () => {

    const [observePost, setObservePost] = useState('')

    const {data: topSubs} = useSWR<Sub[]>(api.topSubs)

    const {data, error, isValidating, mutate, size: page, setSize: setPage}: any = useSWRInfinite<Post[]>(
        index => `${api.posts}?page=${index}`
    )
    const posts: Post[] = data ? [].concat(...data) : [];
    const isLoadingInitialData = !data && !error;


    useEffect(() => {
        if (!posts || posts.length === 0) return

        const id = posts[posts.length - 1].identifier

        if (id !== observePost) {
            setObservePost(id)
            // @ts-ignore
            observeElement(document.getElementById(id))
        }
    }, [posts])

    const observeElement = (element: HTMLElement) => {
        if (!element) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting === true) {
                console.log('Reached bottom of posts')
                setPage(page + 1)
                observer.unobserve(element)
            }
        }, {threshold: 1})
        observer.observe(element)
    }

    return (
        <div className="pt-12">
            <Head>
                <title>readit: the front page of the readit</title>
            </Head>

            <div className="container flex pt-4 justify-center">
                {/* Posts feed */}
                <div className="w-160">
                    {isLoadingInitialData && <p className="text-lg text-center">Loading..</p>}
                    {posts && posts.map((post: Post) => (
                            <PostCard key={post.identifier + post.slug} post={post} mutate={mutate}/>
                        )
                    )}
                    {isValidating && posts.length > 0 && (<p className="text-lg text-center">Loading More..</p>)}
                </div>
                {/* Sidebar */}

                <div className="ml-6 w-80">
                    <div className="bg-white rounded">
                        <div className="p-4 border-b-2">
                            <p className="text-lg font-semibold text-center">
                                Top Communities
                            </p>
                        </div>
                        <div>
                            {topSubs?.map((sub: Sub) => (
                                <div
                                    key={sub.name}
                                    className="flex items-center px-4 py-2 text-xs border-b"
                                >
                                    <div className="mr-2 overflow-hidden rounded-full cursor-pointer">
                                        <Link href={`/r/${sub.name}`}>
                                            <img
                                                src={sub.imageUrl}
                                                alt="Sub"
                                                width={(6 * 16) / 4}
                                                height={(6 * 16) / 4}
                                            />
                                        </Link>
                                    </div>
                                    <Link href={`/r/${sub.name}`}>
                                        <a className="font-bold hover:cursor-pointer">
                                            /r/{sub.name}
                                        </a>
                                    </Link>
                                    <p className="ml-auto font-med">{sub.postCount}</p>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t-2">
                            <Link href="/subs/create">
                                <a className="w-full px-2 py-1 blue button">
                                    Create Community
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Home

/*export const getServerSideProps: GetServerSideProps = async () => {
    try {
        const res: any = await axios.get(api.posts)

        return {props: {posts: res.data.posts}}
    } catch (err) {
        return {props: {error: 'Something went wrong'}}
    }
}*/



