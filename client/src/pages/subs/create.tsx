import axios from 'axios'
import {GetServerSideProps} from 'next'
import Head from 'next/head'
import {FormEvent, useState} from 'react'
import classNames from 'classnames'
import {useRouter} from 'next/router'
import api from '../../utils/api-endpoints'

export default function create() {
    const [name, setName] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [errors, setErrors] = useState<Partial<any>>({})

    const router = useRouter()

    const submitForm = async (event: FormEvent) => {
        event.preventDefault()

        try {
            const res: any = await axios.post(api.subs, {name, title, description})

            await router.push(`/r/${res.data.sub.name}`)
        } catch (err: any) {
            console.log(err)
            setErrors(err.response.data.errors)
        }
    }

    return (
        <div className="flex bg-white">
            <Head>
                <title>Create a Community</title>
            </Head>
            <div
                className="h-screen bg-center bg-cover w-36"
                style={{backgroundImage: "url('/images/signup-bg.png')"}}
            ></div>
            <div className="flex flex-col justify-center pl-6">
                <div className="w-98">
                    <h1 className="mb-2 text-lg font-medium">Create a Community</h1>
                    <hr/>
                    <form onSubmit={submitForm}>
                        <div className="my-6">
                            <p className="font-medium">Name</p>
                            <p className="mb-2 text-xs text-gray-500">
                                Community names including capitalization cannot be changed.
                            </p>
                            <input
                                type="text"
                                className={classNames(
                                    'w-full p-3 border border-gray-200 rounded hover:border-gray-500',
                                    {'border-red-600': errors.name}
                                )}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {errors.name && <small className="font-medium text-red-600">{errors.name.msg}</small>}
                        </div>
                        <div className="my-6">
                            <p className="font-medium">Title</p>
                            <p className="mb-2 text-xs text-gray-500">
                                Community title represent the topic an you change it at any
                                time.
                            </p>
                            <input
                                type="text"
                                className={classNames(
                                    'w-full p-3 border border-gray-200 rounded hover:border-gray-500',
                                    {'border-red-600': errors.name}
                                )}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            {errors.title && <small className="font-medium text-red-600">{errors.title.msg}</small>}
                        </div>
                        <div className="my-6">
                            <p className="font-medium">Description</p>
                            <p className="mb-2 text-xs text-gray-500">
                                This is how new members come to understand your community.
                            </p>
                            <textarea
                                className={classNames(
                                    'w-full p-3 border border-gray-200 rounded hover:border-gray-500',
                                    {'border-red-600': errors.description}
                                )}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            {errors.description && <small className="font-medium text-red-600">
                                {errors.description.msg}
                            </small>}
                        </div>
                        <div className="flex justify-end">
                            <button className="px-4 py-1 text-sm font-semibold capitalize blue button">
                                Create Community
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async ({req, res}): Promise<any> => {
    try {
        const cookie = req.headers.cookie
        if (!cookie) throw new Error('Missing auth token cookie')

        await axios.get(api.me, {headers: {cookie}})

        return {props: {}}
    } catch (err) {
        res.writeHead(307, {Location: '/auth/login'}).end()
    }
}