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
  configEnv = CONFIG_ENV;
} else {
  configEnv = REACT_APP_CONFIG_ENV || 'production'; // default to production if unspecified
}

switch (configEnv) {
  case 'dev':
  case 'development':
  case 'prod':
  case 'production':
  default: {
    const { default: prodConfig } = require('./prod');
    config = { ...defaultConfig, ...prodConfig };
    break;
  }
}

// to prevent eslint error:
// error  Exporting mutable 'let' binding, use 'const' instead  import/no-mutable-exports
const exportedConfig = config;

export default exportedConfig;
