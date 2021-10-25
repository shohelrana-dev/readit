import type {NextPage} from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React, {FormEvent, useState} from "react";
import axios from "axios";
import api from "../../utils/api-endpoints";
import InputGroup from "../../components/common/InputGroup";
import {useRouter} from "next/router";
import {useAuthState} from "../../context/auth";

const Signup: NextPage = () => {

    const [errors, setErrors] = useState<any>({})
    const [loading, setLoading] = useState<boolean>(false)
    const {authenticated} = useAuthState()
    const router = useRouter()

    if (authenticated) router.push('/')

    const submitSignupForm = async (event: FormEvent) => {
        event.preventDefault()
        const form: any = event.target
        let username = form.username.value
        let email = form.email.value
        let password = form.password.value
        let agreement = form.agreement.checked
        if (!agreement) {
            setErrors({
                agreement: {
                    msg: 'You must agree to T&Cs!'
                }
            })
            return
        }
        setLoading(true)

        try {
            await axios.post(api.signup, {username, email, password})
            await router.push('/auth/login')
        } catch (err: any) {
            let {errors} = err.response.data
            if (errors) setErrors(errors)
            setLoading(false)
        }
    }

    return (
        <div>
            <Head>
                <title>Signup</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <div className="flex bg-white">
                <div className="w-40 h-screen bg-cover bg-center"
                     style={{backgroundImage: "url('/images/signup-bg.png')"}}>
                </div>
                <div className="flex flex-col justify-center pl-6">
                    <div className="w-70">
                        <h1 className="text-lg mb-2 font-medium">Sign Up</h1>
                        <p className="mb-10 text-xs">
                            By continuing, you agree to our User Agreement and Privacy Policy.
                        </p>
                        <form method="post" onSubmit={submitSignupForm}>
                            <div className="mb-6">
                                <input type="checkbox"
                                       className="mr-1 cursor-pointer" name="agreement" id="agreement"/>
                                <label htmlFor="agreement" className="text-xs  cursor-pointer">
                                    I agree to get emails about cool stuff on Readit
                                </label>
                                {errors.agreement && (
                                    <small className="block font-medium text-red-600">
                                        {errors.agreement.msg}
                                    </small>
                                )}
                            </div>
                            <InputGroup className="mb-2" type="text" name="username" placeholder="Username"
                                        error={errors?.username?.msg}/>
                            <InputGroup className="mb-2" type="email" name="email" placeholder="Email"
                                        error={errors?.email?.msg}/>
                            <InputGroup className="mb-2" type="password" name="password" placeholder="Password"
                                        error={errors?.password?.msg}/>
                            <button
                                disabled={loading}
                                className="transition duration-300 disabled:cursor-default disabled:bg-blue-300 w-full rounded py-3 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500">
                                {loading ? 'Loading...' : 'Signup'}
                            </button>
                        </form>
                        <small>
                            Already a Readiter?
                            <Link href="/auth/login">
                                <a className="ml-1 text-blue-500 uppercase">
                                    Login
                                </a>
                            </Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
