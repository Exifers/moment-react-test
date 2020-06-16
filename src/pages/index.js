import Head from 'next/head'
import Movies from '../components/Movies'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Movies</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Lato&display=swap" rel="stylesheet"/>
      </Head>

      <main>
        <Movies/>
      </main>
    </div>
  )
}
