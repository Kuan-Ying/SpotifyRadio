import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import configureStore from './redux/configureStore';
import NavigationService from './services/NavigationService';
import RadioRoom from './components/RadioRoom';
import LandingPage from './components/LandingPage';

export const store = configureStore();
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router ref={({ history }) => NavigationService.setHistoryRef(history)}>
          <div>
            <Route exact path="/radio/:id" component={RadioRoom} />
            <Route exact path="/" component={LandingPage} />
          </div>
        </Router>
      </Provider>
    );
  }
}


export default App;
