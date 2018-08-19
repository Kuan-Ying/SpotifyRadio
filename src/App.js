import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

import SpotifyPlayer from './components/SpotifyPlayer';

export const store = configureStore();
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <SpotifyPlayer />
        </div>
      </Provider>
    );
  }
}


export default App;
