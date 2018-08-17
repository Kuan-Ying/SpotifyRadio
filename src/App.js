import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

//import SpotifyPlayer from './components/SpotifyPlayer';
import TrackPlayControl from './components/SpotifyPlayer/TrackPlayControl';

export const store = configureStore();
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <TrackPlayControl />
        </div>
      </Provider>
    );
  }
}


export default App;
