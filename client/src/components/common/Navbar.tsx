import React, {Fragment, useEffect, useState} from 'react'
import Link from "next/link"
import Image from "next/image"
import redditLogo from "../../images/logo.svg"
import {useAuthDispatch, useAuthState} from "../../context/auth";
import axios from "axios";
import api from "../../utils/api-endpoints";
import {Sub} from "../../utils/types";
import {useRouter} from "next/router";

const Navbar: React.FC = () => {

    const [searchName, setSearchName] = useState('')
    const [subs, setSubs] = useState<Sub[]>([])

    const {authenticated, loading} = useAuthState();
    const authDispatch: any = useAuthDispatch();


    const router = useRouter()

    const logout = async () => {
        try {
            const {data}: any = await axios.get(api.logout)
            if (data.success) {
                authDispatch('LOGOUT')
                window.location.reload()
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (searchName.trim() === '') {
            setSubs([])
            return
        }
        searchSubs()
    }, [searchName]);


    const searchSubs = async () => {
        setTimeout(async () => {
            if (searchName === '') {
                setSearchName('')
                return
            }
            try {
                const {data}: any = await axios.get(`${api.searchSubs}/${searchName}`)
                setSubs(data)
            } catch (err) {
                console.log(err)
            }
        }, 500)
    }

    const goToSub = (subName: string) => {
        setSearchName('');
        router.push(`/r/${subName}`)
    }

    return (
        <div className="bg-white fixed inset-x-0 top-0 z-10 flex items-center justify-center h-12 px-5">
            {/*Logo and title*/}
            <div className="flex items-center">
                <Link href="/">
                    <a>
                        <Image src={redditLogo} height={30} width={30}/>
                    </a>
                </Link>
                <span className="text-2xl font-semibold">
                    readit
                </span>
            </div>
            {/*Search input*/}
            <div
                className="flex bg-gray-100 items-center mx-auto border rounded hover:border-blue-500 hover:bg-white">
                <i className="fas fa-search pl-4 pr-3 text-gray-500 "></i>
                <input
                    type="text"
                    className="w-160 bg-transparent py-1 pr-3 rounded focus:outline-none"
                    placeholder="Search"
                    onChange={e => setSearchName(e.target.value)}
                />
                <div
                    className="absolute left-auto bg-white max-w-4xl "
                    style={{top: '100%'}}
                >
                    {subs?.map((sub) => (
                        <div
                            key={sub.name}
                            className="flex px-4 py-3 cursor-pointer hover:bg-gray-200"
                            onClick={() => goToSub(sub.name)}
                        >
                            {sub.imageUrl && <Image
                                src={sub.imageUrl}
                                className="rounded-full"
                                alt="Sub"
                                height={(8 * 16) / 4}
                                width={(8 * 16) / 4}
                            />}
                            <div className="ml-4 text-sm">
                                <p className="font-medium">{sub.name}</p>
                                <p className="text-gray-600">{sub.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/*Auth buttons*/}
            <div className="flex ">
                {!loading && authenticated ? (
                    <button className="w-32 py-1 mr-3 hollow blue button leading-5" onClick={logout}>
                        Logout
                    </button>
                ) : (
                    <Fragment>
                        <Link href="/auth/login">
                            <a className="w-32 py-1 mr-3 hollow blue button leading-5">
                                Login
                            </a>
                        </Link>
                        <Link href="/auth/signup">
                            <a className="w-32 py-1 blue button leading-5">
                                Signup
                            </a>
                        </Link>
                    </Fragment>
                )}
            </div>
        </div>
    );
};

export default Navbar;
