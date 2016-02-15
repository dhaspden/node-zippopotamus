'use strict';

const chai = require('chai');
const should = chai.should();
const nock = require('nock');
const rewire = require('rewire');

const sinon = require('sinon');
chai.use(require('sinon-chai'));

let wrapper = rewire('./wrapper');
const data = require('./wrapper.spec.json');

const URLS = {
  http: 'http://api.zippopotam.us',
  https: 'https://api.zippopotam.us'
};

describe('Wrapper', () => {
  describe('#query', () => {
    it('gets information for a place given the country and zip code', () => {
      nock(URLS.https)
        .get(`/${data.us_code_valid.request.country}/${data.us_code_valid.request.code}`)
        .reply(200, data.us_code_valid.response);

      return wrapper
        .query(data.us_code_valid.request)
        .then(response => {
          response.should.deep.equal(data.us_code_valid.response);
        });
    });

    it('gets information for a place given the country, state and city', () => {
      nock(URLS.https)
        .get(
          '/' + data.us_city_valid.request.country + '/' + data.us_city_valid.request.state +
          '/' + data.us_city_valid.request.city
        )
        .reply(200, data.us_city_valid.response);

      return wrapper
        .query(data.us_city_valid.request)
        .then(response => {
          response.should.deep.equal(data.us_city_valid.response);
        });
    });

    it('gets information for a place in canada given a postal code', () => {
      nock(URLS.https)
        .get(`/${data.ca_code_valid.request.country}/${data.ca_code_valid.request.code}`)
        .reply(200, data.ca_code_valid.response);

      return wrapper
        .query(data.ca_code_valid.request)
        .then(response => {
          response.should.deep.equal(data.ca_code_valid.response);
        });
    });

    it('gets information for a place in canada given a city and province', () => {
      nock(URLS.https)
        .get(
          '/' + data.ca_city_valid.request.country + '/' + data.ca_city_valid.request.state +
          '/' + data.ca_city_valid.request.city
        )
        .reply(200, data.ca_city_valid.response);

      return wrapper
        .query(data.ca_city_valid.request)
        .then(response => {
          response.should.deep.equal(data.ca_city_valid.response);
        });
    });

    it('gets information for a place over http (as opposed to https)', () => {
      nock(URLS.http)
        .get(`/${data.us_code_valid.request.country}/${data.us_code_valid.request.code}`)
        .reply(200, data.us_code_valid.response);

      wrapper.__set__('API', 'http://api.zippopotam.us');
      return wrapper
        .query(data.us_code_valid.request)
        .then(response => {
          response.should.deep.equal(data.us_code_valid.response);
          wrapper.__set__('API', 'https://api.zippopotam.us');
        });
    });

    it('truncates a long postal code to only the part required', () => {
      nock(URLS.https)
        .get(`/${data.ca_code_truncate.request.country}/${data.ca_code_truncate.truncated}`)
        .reply(200, data.ca_code_truncate.response);

      return wrapper
        .query(data.ca_code_truncate.request)
        .then(response => {
          response.should.deep.equal(data.ca_code_truncate.response);
        });
    });

    it('does not truncate if the code should not be truncated', () => {
      nock(URLS.https)
        .get(`/${data.lk_code_valid.request.country}/${data.lk_code_valid.request.code}`)
        .reply(200, data.lk_code_valid.response);

      return wrapper
        .query(data.lk_code_valid.request)
        .then(response => {
          response.should.deep.equal(data.lk_code_valid.response);
        });
    });

    it('calls a callback function if a callback function is provided', () => {
      nock(URLS.https)
        .get(`/${data.us_code_valid.request.country}/${data.us_code_valid.request.code}`)
        .reply(200, data.us_code_valid.response);

      const callback = sinon.spy();
      return wrapper
        .query(data.us_code_valid.request, callback)
        .then(response => {
          callback.should.have.been.calledOnce;
          callback.should.have.been.calledWith(null, data.us_code_valid.response);
        });
    });

    it('throws an error if an invalid url is provided', () => {
      wrapper.__set__('API', 'invalid');
      return wrapper
        .query(data.us_code_valid.request)
        .catch(error => {
          error.toString().should.equal('Error: connect ECONNREFUSED 127.0.0.1:80');
          wrapper.__set__('API', 'https://api.zippopotam.us');
        });
    });

    it('throws an error if no options are provided', () => {
      return wrapper.query()
        .catch(error => {
          error.should.deep.equal(new Error('Invalid query object provided.'));
        });
    });

    it('throws an error if an invalid options combination is provided', () => {
      return wrapper
        .query(data.invalid_options)
        .catch(error => {
          error.should.deep.equal(new Error('Invalid query object provided.'));
        });
    });

    it('throws an error if an invalid country is provided', () => {
      return Promise.all([
        wrapper
          .query({
            country: 'LONG',
            code: 400
          })
          .catch(error => {
            error.should.deep.equal(new Error('Invalid country provided: LONG'));
            return Promise.resolve();
          }),
        wrapper
          .query({
            country: 'JX',
            code: 400
          })
          .catch(error => {
            error.should.deep.equal(new Error('Invalid country provided: JX'));
            return Promise.resolve();
          })
      ])
    });

    it('throws an error to the callback function if a callback function is provided', () => {
      wrapper.__set__('API', 'invalid');
      const callback = sinon.spy();

      return wrapper
        .query(data.us_code_valid.request, callback)
        .catch(error => {
          callback.should.have.been.calledOnce;
          callback.should.have.been.calledWith(error);
          wrapper.__set__('API', 'https://api.zippopotam.us');
        });
    });
  });
});