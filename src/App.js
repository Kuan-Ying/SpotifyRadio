import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

import SongTrackCard from './components/SongTrackCard';

export const store = configureStore();
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <SongTrackCard />;
        </div>
      </Provider>
    );
  }
}


export default App;
