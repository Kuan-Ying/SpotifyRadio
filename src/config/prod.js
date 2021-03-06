const {
  REACT_APP_RUNTIME_FIREBASE_API_KEY,
  REACT_APP_RUNTIME_FIREBASE_AUTH_DOMAIN,
  REACT_APP_RUNTIME_FIREBASE_DATABASE_URL,

  REACT_APP_RUNTIME_SPOTIFY_CLIENT_ID,
  REACT_APP_RUNTIME_SPOTIFY_REDIRECT_URI,
} = process.env;

export default {
  env: 'PRODUCTION',
  firebase: {
    apiKey: REACT_APP_RUNTIME_FIREBASE_API_KEY,
    authDomain: REACT_APP_RUNTIME_FIREBASE_AUTH_DOMAIN,
    databaseURL: REACT_APP_RUNTIME_FIREBASE_DATABASE_URL,
  },
  spotify: {
    client_id: REACT_APP_RUNTIME_SPOTIFY_CLIENT_ID,
    redirect_uri: REACT_APP_RUNTIME_SPOTIFY_REDIRECT_URI,
  },
};
