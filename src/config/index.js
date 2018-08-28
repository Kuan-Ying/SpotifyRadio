import defaultConfig from './default';

const {
  NODE_ENV,
  REACT_APP_CONFIG_ENV,
  CONFIG_ENV,
} = process.env;

let configEnv;
let config;

// when the app is running in production mode
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
    const { default: devConfig } = require('./dev');
    config = { ...defaultConfig, ...devConfig };
    break;
  }
  case 'prod':
  case 'production': {
    const { default: prodConfig } = require('./prod');
    config = { ...defaultConfig, ...prodConfig };
    break;
  }
  case 'local':
  default: {
    const { default: devConfig } = require('./dev');
    config = { ...defaultConfig, ...devConfig };
    break;
  }
}

// to prevent eslint error:
// error  Exporting mutable 'let' binding, use 'const' instead  import/no-mutable-exports
const exportedConfig = config;

export default exportedConfig;
