import defaultConfig from './default';

const { REACT_APP_RUNTIME_CONFIG_ENV: configEnv } = process.env;

let config;

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
