'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var query = function () {
  var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(options, callback) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', new _promise2.default(function (resolve, reject) {
              if ((typeof options === 'undefined' ? 'undefined' : (0, _typeof3.default)(options)) !== 'object') throw new Error('Invalid query object provided.');else {
                if (!(options.country && options.code) && !(options.country && options.state && options.city)) {
                  throw new Error('Invalid query object provided');
                }

                options.country = options.country.toUpperCase();
                if (options.country.length !== 2 || !COUNTRIES[options.country]) {
                  throw new Error('Invalid country provided: ' + options.country);
                }

                if (options.code) {
                  if (typeof COUNTRIES[options.country] === 'number') {
                    options.code = new String(options.code);
                    options.code = options.code.slice(0, COUNTRIES[options.country]);
                  }
                }

                var request = (API.startsWith('https') ? https : http).get(API + '/' + (options.code ? options.country + '/' + options.code : options.country + '/' + options.state + '/' + options.city), function (response) {
                  var body = new String();
                  response.on('data', function (data) {
                    return body += data;
                  });
                  response.on('end', function () {
                    var parsed = JSON.parse(body);

                    resolve(parsed);
                    if (callback) callback(null, parsed);
                  });
                });

                request.on('error', function (error) {
                  reject(error);
                  if (callback) callback(error);
                });

                request.end();
              }
            }));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));
  return function query(_x, _x2) {
    return ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var http = require('http');
var https = require('https');

var API = process.env.ZIPPOPOTAMUS_API_URL || 'https://api.zippopotam.us';
var COUNTRIES = require('./data/countries.json');

exports.query = query;