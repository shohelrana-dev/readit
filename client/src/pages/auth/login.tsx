import type {NextPage} from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React, {FormEvent, useState} from "react";
import axios from "axios";
import api from "../../utils/api-endpoints";
import InputGroup from "../../components/common/InputGroup";
import {useRouter} from "next/router";
import {useAuthDispatch, useAuthState} from "../../context/auth";

const Login: NextPage = () => {

    const [errors, setErrors] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()
    const authDispatch: any = useAuthDispatch()
    const {authenticated} = useAuthState()

    if (authenticated) router.push('/')

    const submitSignupForm = async (event: FormEvent) => {
        setLoading(true)
        event.preventDefault()
        const form: any = event.target
        let username = form.username.value
        let password = form.password.value

        try {
            const res: any = await axios.post(api.login, {username, password})
            const {user, success} = res.data;
            if (success) {
                authDispatch('LOGIN', user)
                await router.back()
            }
            setLoading(false)
        } catch (err: any) {
            let {errors} = err.response.data
            if (errors) setErrors(errors)
            setLoading(false)
        }
    }


    return (
        <div>
            <Head>
                <title>Login</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <div className="flex bg-white">
                <div className="w-40 h-screen bg-cover bg-center"
                     style={{backgroundImage: "url('/images/signup-bg.png')"}}>
                </div>
                <div className="flex flex-col justify-center pl-6">
                    <div className="w-70">
                        <h1 className="text-lg mb-2 font-medium">Login</h1>
                        <form method="post" onSubmit={submitSignupForm}>
                            <InputGroup className="mb-2" type="text" name="username" placeholder="Username"
                                        error={errors?.username?.msg}/>
                            <InputGroup className="mb-2" type="password" name="password" placeholder="Password"
                                        error={errors?.password?.msg}/>
                            <button
                                disabled={loading}
                                className="transition duration-300 disabled:cursor-default disabled:bg-blue-300 w-full rounded py-3 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500">
                                {loading ? 'Loading...' : 'Login'}
                            </button>
                        </form>
                        <small>
                            New to readit?
                            <Link href="/auth/signup">
                                <a className="ml-1 text-blue-500 uppercase">
                                    Signup
                                </a>
                            </Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
