import Head from 'next/head'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Features from '../components/Features'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>PRISM USA LLC - Affordable Software Solutions for Small Business</title>
        <meta name="description" content="Professional software services for small businesses including network monitoring, queue management, and custom development solutions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      <main>
        <Hero />
        <Services />
        <Features />
        <Contact />
      </main>
      <Footer />
    </>
  )
}