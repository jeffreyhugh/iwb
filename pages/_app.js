import '../styles/global.css'
import { ThemeProvider } from 'next-themes'
import Head from 'next/head'
import * as gtag from '../lib/gtag'
import { useEffect } from 'react'
import Router from 'next/router';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        const handleRouteChange = (url) => {
            gtag.pageview(url);
        };
        Router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            Router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, []);

    return (
        <ThemeProvider enableSystem={false}>
            <Head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/fork-awesome@1.2.0/css/fork-awesome.min.css" integrity="sha256-XoaMnoYC5TH6/+ihMEnospgm0J1PM/nioxbOUdnM8HY=" crossOrigin="anonymous"></link>
                <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>
            </Head>
            <Component {...pageProps} />
        </ThemeProvider>
    )
}

export default MyApp
