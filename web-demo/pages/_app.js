import './../styles/globals.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import Head from 'next/head';
import { 
  faEnvelope, 
  faKey,
  faSpinner,
  faDragon
} from '@fortawesome/free-solid-svg-icons';

function MyApp({ Component, pageProps }) {
  library.add(faEnvelope, faKey, faSpinner, faDragon);

  return (
    <div>
      <Head>
        <title>Demo v1</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/shuriken-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/shuriken-16x16.png" />
      </Head>
      <Component {...pageProps} />
    </div>
    )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp