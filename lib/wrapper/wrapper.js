'use strict';

const http = require('http');
const https = require('https');

const API = process.env.ZIPPOPOTAMUS_API_URL || 'https://api.zippopotam.us';
const COUNTRIES = require('./data/countries.json');

exports.query = query;
async function query(options, callback) {
  return new Promise((resolve, reject) => {
    if (typeof options !== 'object') throw new Error('Invalid query object provided.');
    else {
      if (
        !(options.country && options.code) &&
        !(options.country && options.state && options.city)
      ) {
        throw new Error('Invalid query object provided');
      }

      options.country = options.country.toUpperCase();
      if (typeof options.state === 'string') options.state = options.state.toUpperCase();

      if (options.country.length !== 2 || !COUNTRIES[options.country]) {
        throw new Error(`Invalid country provided: ${options.country}`);
      }

      if (options.code) {
        if (typeof COUNTRIES[options.country] === 'number') {
          if ((new String(options.code)).length < COUNTRIES[options.country]) {
            throw new Error(`Zip code provided is too short: ${options.code}`);
          }

          options.code = new String(options.code);
          options.code = options.code.slice(0, COUNTRIES[options.country]);
        }
      }

      const request = (API.startsWith('https') ? https : http).get(API + '/' + (
        options.code ?
          `${options.country}/${options.code}` :
          `${options.country}/${options.state}/${options.city}`
      ), response => {
        let body = new String();
        response.on('data', data => body += data);
        response.on('end', () => {
          const parsed = JSON.parse(body);

          resolve(parsed);
          if (callback) callback(null, parsed);
        });
      });

      request.on('error', error => {
        reject(error);
        if (callback) callback(error);
      });

      request.end();
    }
  });
}