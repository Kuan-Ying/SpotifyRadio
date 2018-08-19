import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';

import RadioRoom from './components/RadioRoom';

export const store = configureStore();
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RadioRoom />
      </Provider>
    );
  }
}


export default App;
