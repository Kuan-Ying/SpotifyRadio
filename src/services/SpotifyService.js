const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class SpotifyService {
  player;
  accessToken;
  deviceId;

  constructor() {
    const authUrl = 'https://accounts.spotify.com/authorize';
    this.getAccessTokenFromRoute();
    if (!this.accessToken) {
      // TODO: refactor client_id and redirect_uri into seperate file
      const client_id = '7c64e4430f07419fb440e31ecb259838';
      const redirect_uri = 'http://localhost:3000/callback';
      const scopes = ['user-read-private', 'user-read-email', 'user-modify-playback-state'];
      const params = {
        response_type: 'token',
        client_id,
        scopes,
        redirect_uri,
      };
      const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
      window.location.href = `${authUrl}?${queryString}`;
    }
  }

  getAccessTokenFromRoute = () => {
    const hashParams = {};
    // eslint-disable-next-line
    let e,
      // eslint-disable-next-line
      r = /([^&;=]+)=?([^&;]*)/g,
      // eslint-disable-next-line
      q = window.location.hash.substring(1);
    // eslint-disable-next-line
	  while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    this.accessToken = hashParams.access_token;
  }

  initPlayerAsync = async (name) => {
    while (!(window.Spotify && window.Spotify.Player)) {
      // eslint-disable-next-line
      await delay(500);
    }
    this.player = new window.Spotify.Player({
      name,
      getOAuthToken: (cb) => { cb(this.accessToken); },
    });
    this.player.connect();
    await this.initListeners();
    return this.accessToken;
  }

  initListeners = () => {
    // problem setting up the player
    this.player.on('initialization_error', (e) => {
      console.log(e);
    });
    // NOTE: problem authenticating the user.
    // either the token was invalid in the first place,
    // or it expired (it lasts one hour)
    this.player.on('authentication_error', (e) => {
      console.log(e);
    });
    // NOTE: currently only premium accounts can use the API
    this.player.on('account_error', (e) => {
      console.log(e);
    });
    // NOTE: loading/playing the track failed for some reason
    this.player.on('playback_error', (e) => {
      console.log(e);
    });
    return new Promise((resolve) => {
      // NOTE: Ready
      this.player.on('ready', ({ device_id }) => {
        console.log('Spotify player is ready!');
        this.deviceId = device_id;
        resolve({ deviceId: this.deviceId, accessToken: this.accessToken });
      });
    });
  }

  play = async ({
    spotifyUri,
    positionMs,
  }) => {
    console.log(spotifyUri);
    // NOTE: play the track uri
    let result = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({
        uris: [spotifyUri],
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    if (result.status !== 200
      || result.status !== 204
      || result.status !== 202) {
      return result;
    }
    // NOTE: seek to desired position.
    result = await fetch(`https://api.spotify.com/v1/me/player/seek?=position_ms=${positionMs}&device_id=${this.deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return result;
  };

  getCurrentState = async () => {
    const result = await this.player.getCurrentState();
    if (!result) {
      console.error('User is not connected');
    }
    return result;
  };
}

export default new SpotifyService();
