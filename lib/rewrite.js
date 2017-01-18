'use strict';

var url = require('url');

var _ = require('lodash');

var rewrite = function (route, options) {
  var parsedRoute;

  options = _.defaults({
    protocol: undefined,
    defaultHost: undefined
  }, options);

  parsedRoute = url.parse(route);
  parsedRoute.host = undefined;

  if (options.protocol) {
    parsedRoute.protocol = options.protocol;
  }
  if (options.defaultHost) {
    parsedRoute.hostname = options.defaultHost;
  }
  if (options.port) {
    parsedRoute.port = options.port;
  }

  return url.format(parsedRoute);
};

module.exports = rewrite;
