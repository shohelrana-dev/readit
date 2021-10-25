import axios from 'axios'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {FormEvent, useEffect, useState} from 'react'
import useSWR from 'swr'
import Sidebar from '../../../components/sub/Sidebar'
import {Post, Sub} from '../../../utils/types'
import api from '../../../utils/api-endpoints'
import {useAuthState} from "../../../context/auth";

export default function submit() {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    const {authenticated} = useAuthState()
    const router = useRouter()
    const {sub: subName} = router.query

    // @ts-ignore
    useEffect(() => {
        return async () => {
            if (!authenticated) await router.push('/auth/login')
        }
    }, [])

    const {data: sub, error}: any = useSWR<Sub>(subName ? `${api.subs}/${subName}` : null)
    if (error) console.log(error)

    const submitPost = async (event: FormEvent) => {
        event.preventDefault()

        if (title.trim() === '') return

        try {
            const {data}: any = await axios.post<Post>(api.posts, {
                title: title.trim(),
                body,
                sub: sub.name,
            })

            await router.push(`/r/${sub.name}/${data.post.identifier}/${data.post.slug}`)
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="container flex pt-5 justify-center">
            <Head>
                <title>Submit to Readit</title>
            </Head>
            <div className="w-160">
                <div className="p-4 bg-white rounded">
                    <h1 className="mb-3 text-lg">Submit a post to /r/{subName}</h1>
                    <form onSubmit={submitPost}>
                        <div className="relative mb-2">
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none"
                                placeholder="Title"
                                maxLength={300}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <div
                                className="absolute mb-2 text-sm text-gray-500 select-none focus:border-gray-600"
                                style={{top: 11, right: 10}}
                            >
                                {/* e.g. 15/300 */}
                                {title.trim().length}/300
                            </div>
                        </div>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-gray-600"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Text (optional)"
                            rows={4}
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                className="px-3 py-1 blue button"
                                type="submit"
                                disabled={title.trim().length === 0}
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {sub && <Sidebar sub={sub}/>}
        </div>
    )
}