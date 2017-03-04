require('babel-core/register');
require("babel-polyfill");
// require the rest of the app that needs to be transpiled after the hook
const app = require('./app');
