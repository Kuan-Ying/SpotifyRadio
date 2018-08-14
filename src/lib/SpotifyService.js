
class SpotifyService {
  player;
  Spotify;
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

  initPlayerAsync(name) {
    return new Promise((resolve, reject) => {
      this.playerCheckInterval = setInterval(
        () => this.checkForPlayer(resolve, reject, name), 1000);
    });
  }

  checkForPlayer(resolve, reject, name) {
    // if the Spotify SDK has loaded
    if (window.Spotify && window.Spotify.Player) {
      // cancel the interval
      clearInterval(this.playerCheckInterval);
      // create a new player
      this.player = new window.Spotify.Player({
        name,
        getOAuthToken: (cb) => { cb(this.accessToken); },
      });
      // set up the player's event handlers
      this.initListeners(resolve, reject);
      // finally, connect!
      this.player.connect();
    }
  }

  initListeners(resolve, reject) {
    // problem setting up the player
    this.player.on('initialization_error', (e) => {
      reject(e);
    });
    // problem authenticating the user.
    // either the token was invalid in the first place,
    // or it expired (it lasts one hour)
    this.player.on('authentication_error', (e) => {
      reject(e);
    });
    // currently only premium accounts can use the API
    this.player.on('account_error', (e) => {
      reject(e);
    });
    // loading/playing the track failed for some reason
    this.player.on('playback_error', (e) => {
      reject(e);
    });

    // Ready
    this.player.on('ready', async (data) => {
      const { device_id } = data;
      console.log('Spotify player is ready!');
      this.deviceId = device_id;
      resolve(`accessToken: ${this.accessToken}, deviceId: ${this.deviceId}`);
    });
  }

  play = async ({
    spotifyUri,
    positionMs,
  }) => {
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
    if (result.status !== 204 || result.status !== 202) {
      return result;
    }
    result = await fetch(`https://api.spotify.com/v1/me/player/seek?=position_ms=${positionMs}&device_id=${this.deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return result;
  };

  getCurrentState = () => {
    this.player.getCurrentState().then((state) => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK');
        return null;
      }
      return state;
    });
  };

  getCurrentTrackInfo = async () => {
    const result = await this.player.getCurrentState();
    if (!result) {
      return console.error('User is not playing music through the Web Playback SDK');
    }
    return result.track_window.current_track;
  }
}

export default new SpotifyService();
