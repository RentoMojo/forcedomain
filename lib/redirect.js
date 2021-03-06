'use strict';

var _ = require('lodash');

var rewrite = require('./rewrite');

var redirect = function (protocol, hostHeader, url, options) {
  var hostHeaderParts,
      hostname,
      port,
      rewrittenRoute,
      route;

  options = _.defaults(options, {
    protocol: 'http',
    type: 'temporary',
    allowedHosts: []
  });

  hostHeaderParts = (hostHeader || '').split(':');
  hostname = hostHeaderParts[0] || '';
  port = (hostHeaderParts[1] - 0) || undefined;
  if (
    (hostname === 'localhost') ||
    ((options.allowedHosts.indexOf(hostname) != -1) && port === options.port && protocol === options.protocol)
  ) {
    return null;
  }
  route = options.protocol + '://' + hostname + (port ? ':' + port : '') + url;
  rewrittenRoute = rewrite(route, options);
  /* eslint-disable consistent-return */
  return {
    type: options.type,
    url: rewrittenRoute
  };
  /* eslint-enable consistent-return */
};

module.exports = redirect;
