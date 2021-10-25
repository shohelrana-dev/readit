export default {
    signup: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/signup`,
    login: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/login`,
    logout: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/logout`,
    me: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/auth/me`,
    users: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/users`,
    posts: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/posts`,
    votes: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/votes`,
    subs: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/subs`,
    topSubs: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/subs/top-subs`,
    searchSubs: `${process.env.NEXT_PUBLIC_SERVER_API_URL}/subs/search`,
}