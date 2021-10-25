import Document, {Html, Head, Main, NextScript, DocumentContext} from 'next/document'

class MyDocument extends Document {
    description = 'Readit is a network of communities where people can dive into their interests, hobbies and passions. There\'s a community for whatever you\'re interested in on Readit.'
    title = 'readit'

    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return {...initialProps}
    }

    render() {
        return (
            <Html>
                <Head>
                    <meta name="description" content={this.description}/>
                    <meta property="twitter:description" content={this.description}/>
                    <meta property="og:description" content={this.description}/>
                    <meta property="og:title" content={this.title}/>
                    <meta property="twitter:title" content={this.title}/>
                    <meta property="og:site_name" content={this.title}/>
                    <meta property="og:type" content="website"/>
                    <meta property="og:image" content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/images/logo.svg`}/>
                    <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_CLIENT_BASE_URL}/images/logo.svg`}/>
                    <meta property="twitter:site" content={'@' + this.title}/>
                    <meta property="twitter:card" content="summary"/>
                    <link rel="icon" type="image/svg+xml" href="/images/logo.svg"/>
                    <link
                        href="//fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&display=swap"
                        rel="stylesheet"/>
                    <link rel="stylesheet"
                          href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
                          integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ=="
                          crossOrigin="anonymous" referrerPolicy="no-referrer"/>
                </Head>
                <body className="font-body" style={{backgroundColor: '#DAE0E6'}}>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}

export default MyDocument