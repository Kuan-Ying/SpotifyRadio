import Cookie from 'js-cookie';

import defaultConfig from './default';
import devConfig from './dev';
import prodConfig from './prod';

const { NODE_ENV, REACT_APP_CONFIG_ENV } = process.env;
const CONFIG_ENV = Cookie.get('CONFIG_ENV');

let configEnv;
let config;

// when the app is running in production mode, e.g. through docker images
if (NODE_ENV === 'production') {
  configEnv = CONFIG_ENV; // use the env setting value in the cookie
} else {
  // if app is running in dev mode, e.g. by `yarn start` or `REACT_APP_CONFIG_ENV=local yarn start`
  // use the env variable to determine which env config to use
  configEnv = REACT_APP_CONFIG_ENV || 'local'; // default to local if unspecified
}

switch (configEnv) {
  case 'dev':
  case 'development': {
    config = { ...defaultConfig, ...devConfig };
    break;
  }
  case 'prod':
  case 'production': {
    config = { ...defaultConfig, ...prodConfig };
    break;
  }
  case 'local':
  default: {
    config = { ...defaultConfig, ...devConfig };
    break;
  }
}

// to prevent eslint error:
// error  Exporting mutable 'let' binding, use 'const' instead  import/no-mutable-exports
const exportedConfig = config;

export default exportedConfig;
