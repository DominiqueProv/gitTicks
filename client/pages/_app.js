import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import { Header } from '../components/header';
// see documentation github.com/zeit/next.js/blob/master/errors/css-global.md
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

// if the getInitialProps is called on the wrapper _app the one below wont call getInitialProps
// work around call the getInitialProps method again inside of the App call
// passing appContext to wrapper AppComponent --line 17
// and appContext.ctx for a page component --line 21 then return pageProps and pass it as props
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  // { } around data extract the data object from the header call, without the { } it would return the whole header
  const { data } = await client.get('/api/users/currentuser');
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  }
  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
