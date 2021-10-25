import '../styles/tailwind.css'
import type {AppProps} from 'next/app'
import axios from "axios"
import Navbar from "../components/common/Navbar"
import {useRouter} from "next/router"
import {AuthProvider} from "../context/auth"
import {SWRConfig} from 'swr'

axios.defaults.withCredentials = true

const App = ({Component, pageProps}: AppProps) => {
    const {pathname} = useRouter()
    const authRoutes = ['/auth/login', '/auth/signup']
    const authRoute = authRoutes.includes(pathname)

    const fetcher = async (url: string) => {
        try {
            const res: any = await axios.get(url)
            return res.data;
        } catch (err: any) {
            throw err.response.data
        }
    }

    return (
        <SWRConfig
            value={{
                fetcher,
                dedupingInterval: 10000
            }}
        >
            <AuthProvider>
                {!authRoute && <Navbar/>}
                <div className={authRoute ? '' : 'pt-12'}>
                    <Component {...pageProps} />
                </div>
            </AuthProvider>
        </SWRConfig>
    )
}

export default App
