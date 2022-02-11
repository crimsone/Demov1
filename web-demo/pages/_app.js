import './../styles/globals.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faEnvelope, 
  faKey,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

function MyApp({ Component, pageProps }) {
  library.add(faEnvelope, faKey, faSpinner);
  return <Component {...pageProps} />
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