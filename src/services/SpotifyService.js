import config from '../config';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class SpotifyService {
  player;
  accessToken;
  deviceId;

  constructor() {
    const authUrl = 'https://accounts.spotify.com/authorize';
    this.accessToken = window.localStorage.getItem('access_token');
    const expireTime = window.localStorage.getItem('expire_time');
    if (!this.accessToken
      || `${this.accessToken}` === 'undefined'
      || expireTime <= Date.now()) {
      this.getAccessTokenFromRoute();
      const { client_id, redirect_uri } = config.spotify;
      const scope = [
        'user-read-private',
        'user-read-email',
        'user-modify-playback-state',
        'user-read-birthdate',
        'user-read-currently-playing',
        'streaming',
      ];
      const params = {
        response_type: 'token',
        client_id,
        scope,
        redirect_uri,
      };
      const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
      window.location.href = `${authUrl}?${queryString}`;
    }
    if (window.location.href.includes('callback')) {
      window.location.href = '/';
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
    window.localStorage.setItem('access_token', hashParams.access_token);
    window.localStorage.setItem('expire_time', Date.now() + (3600 * 1000));
  }

  // NOTE: Spotify player
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
    await this.preparePlayer();
    return this.accessToken;
  }

  preparePlayer = () => new Promise((resolve) => {
    // NOTE: Ready
    this.player.on('ready', ({ device_id }) => {
      console.log('Spotify player is ready!');
      this.deviceId = device_id;
      resolve({ deviceId: this.deviceId, accessToken: this.accessToken });
    });
  });

  // NOTE: play the song and seek to positionMs
  // Should only used for synchroize player.
  // Otherwise, users will sense playbar go back to the start then jump to the desired postion.
  play = async ({ spotifyUri, positionMs }) => {
    // NOTE: play the track uri
    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({
        uris: [spotifyUri],
        position_ms: positionMs,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (response.status !== 200
      && response.status !== 204
      && response.status !== 202) {
      return { status: response.status };
    }
    return response;
  };

  // NOTE: seek to the position desired position.
  seek = async (positionMs) => {
    const response = await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${Math.floor(positionMs)}&device_id=${this.deviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response;
  };

  getCurrentState = () => this.player.getCurrentState();


  togglePlay = () => this.player.togglePlay();

  // NOTE: search songs
  searchTracks = async (query) => {
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      const { tracks: { items } } = data;
      data = items;
    }
    return { status: response.status, data };
  }

  // NOTE: users
  getCurrentUserProfile = async () => {
    const response = await fetch('https://api.spotify.com/v1/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    const data = await response.json();
    return { status: response.status, data };
  }

  getUserProfile = async (userId) => {
    const response = await fetch(`https://api.spotify.com/v1/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    const data = await response.json();
    return { status: response.status, data };
  }
}

export default new SpotifyService();
