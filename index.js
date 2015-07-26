'use strict';

var	zlib = require('zlib');

/**
 * Filter factory.
 * @param types {Array|string...}
 * @return {Function}
 */
module.exports = function (types) {
	if (!Array.isArray(types)) {
		types = [].slice.call(arguments);
	}

	if (types.length === 0) {
		types = [ 'js', 'css', 'html' ];
	}

	return function *(next) {
		var req = this.request;
		var	res = this.response;
		var enc = req.acceptsEncodings('gzip', 'deflate');

		yield next;

		var match = enc
			&& res.status() === 200
			&& res.is(types);

		if (match) {
			res.head('content-encoding', enc)
				.data(yield zlib[enc].bind(zlib, res.data()));
		}
	};
};
