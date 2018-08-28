# Introduction
SpotifyRadio aims to provide a live streaming platform using [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/reference/) and [Spotify Web API](https://developer.spotify.com/documentation/web-api/reference/).

[Live demo](https://secure-spire-91250.herokuapp.com/)

<img src="https://i.imgur.com/5kgeKs5.png" width="600">
<img src="https://i.imgur.com/QpZJVN9.png" width="600">

# Featuring
- React, Redux, Redux Saga
- Semantic UI React, Styled Components
- Spotify Web API, 
- Firebase

# User story
https://hackmd.io/5j_EmejGQ9e6-mHWZoT2gg

# Develop
## Install all packages with yarn
```
yarn
```
## Setup config
Configs should look like below:
```javascript
export default {
  env: 'DEVELOPMENT',
  firebase: {
    // NOTE: dev
    apiKey: 'YOUR FIREBASE KEEY',
    authDomain: 'YOUR FIREBASE AUTH DOMAIN',
    databaseURL: 'YOUR DATABASE URL',
  },
  spotify: {
    client_id:'YOUR SPOTIFY CLIENT ID',
    redirect_uri:'YOUR SPOTIFY REDIRECT URI',
  },
};
```

## Start
### connect to dev server API
yarn start / yarn start-dev

### connect to prod server API
yarn start-prod


# TODOs:
- Renew Spotify user token after it expires (currently it is using Implicit Grant Flow)
- Redirect logic after access token is obtained
- sharing link
