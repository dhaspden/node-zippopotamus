'use strict';

const http = require('http');
const https = require('https');
const API = process.env.ZIPPOPOTAMUS_API_URL || 'https://api.zippopotam.us';

exports.query = query;
async function query(options) {
  return new Promise((resolve, reject) => {
    if (typeof options !== 'object') throw new Error('Invalid query object provided.');
    else {
      if (
        !(options.country && options.code) &&
        !(options.country && options.state && options.city)
      ) {
        throw new Error('Invalid query object provided');
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
        });
      });

      request.on('error', error => reject(error));
      request.end();
    }
  });
}