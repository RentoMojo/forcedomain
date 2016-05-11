'use strict';

var redirect = require('./redirect');

var forceDomain = function (options) {
  return function (req, res, next) {

    var shouldRedirect = true;

    // this request is coming from elb and we don't want to redirect elb ping requests otherwise ec2 instance will go out of service
    if (!req.headers['x-forwarded-proto']){
      shouldRedirect = false;
    } else if (req.headers['x-amz-cf-id'] && req.headers['x-rmj-main-cf']) {
      // this request is coming from our main cf which serves our static content. we want to redirect these requests.
      shouldRedirect = true;
    } else if(req.headers['x-amz-cf-id']) {
      // this request is coming from our product-image cf, we don't want to redirect these requests
      shouldRedirect = false;
    }

    if(!shouldRedirect){
      return next();
    }

    var protocol = req.headers['x-forwarded-proto'] || req.protocol;
    var newRoute = redirect(protocol, req.headers.host, req.url, options),
        statusCode;

    if (!newRoute) {
      return next();
    }

    statusCode = (newRoute.type === 'temporary') ? 307 : 301;
    res.writeHead(statusCode, {
      Location: newRoute.url
    });
    res.end();
  };
};

module.exports = forceDomain;
