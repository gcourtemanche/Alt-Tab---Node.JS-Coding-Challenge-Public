const debug = require('debug');
const config = require('../config');

module.exports = (namespace) => {
  return debug(config.appNamespace + namespace);
};
