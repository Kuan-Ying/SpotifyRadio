const {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,

  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
} = process.env;

export default {
  env: 'PRODUCTION',
  firebase: {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    databaseURL: FIREBASE_DATABASE_URL,
  },
  spotify: {
    client_id: SPOTIFY_CLIENT_ID,
    redirect_uri: SPOTIFY_REDIRECT_URI,
  },
};
