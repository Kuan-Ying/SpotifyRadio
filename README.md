# Introduction
SpotifyRadio aims to provide a live streaming platform using [Spotify Web Playback SDK](https://developer.spotify.com/documentation/web-playback-sdk/reference/) and [Spotify Web API](https://developer.spotify.com/documentation/web-api/reference/).

# Progress
- React/Redux spotify player, support add/remove song to play queue
- Sync play queue with firebase

<img src="https://i.imgur.com/d0zeX0M.png" width="300">
<img src="https://i.imgur.com/3PBDtA5.png" width="600">

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
- Renew Spotify user token after it expires
- Sync logic with firebase
- Refactor the way to obtain Spotify user token
- Chat room with firebase
