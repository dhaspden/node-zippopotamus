# Node Zippopotamus
---

*Node Zippopotamus* is an API wrapper for the **Zippopotamus** zip (and postal code) service.  The **Zippopotamus** service can be found [here](http://zippopotam.us).  This wrapper makes the process of submitting requests to the API as easy and having the country code and zip code to query for.  The results are returned according to the return formatting of the API itself.

*Node Zippopotamus* provides the following functionality:

- Query for information (including location) of a zip (or postal code)
- **Upcoming:** Cache results for increased efficiency and to make fewer requests to the API

## Installation

```npm install --save zippopotamus```

## Examples

```javascript
// Use your own server, or http (https is default)
// process.env.ZIPPOPOTAMUS_API_URL = 'http://api.zippopotam.us';

const zippopotamus = require('zippopotamus');

// Query for a zip code, given the country and zip code
zippopotamus
  .query({
    country: 'US',
    code: '90210'
  })
  .then(information => {
    // Returns the response from the API
    // Returns an empty object ({ }) if no results are found
  });

// Query for a zip code, given the country, state and zip code
zippopotamus
  .query({
    country: 'US',
    state: 'TX',
    city: 'Dallas'
  })
  .then(information => {
    // ...
  });

// Query for a zip code, given the country, zip code and a callback
zippopotamus.query({
  country: 'CA',
  code: 'L6A'
}, (error, response) => {
  if (error) // ...
  else {
    // ...
  }
});
```

## API

### zippopotamus.query(options[, callback]) -> Promise.<information|Error>

Queries the Zippopotamus server for information given the options.  Queries using either the country and zip code, or using the country, state and city.  Returns the raw results from the API to the caller as a **promise**.

- **options** - Options to pass through to Zippopotamus

  - **options.country** - Country to query for from the server
  - **[options.code]** - Zip code to query for from the server, should match the codes of the country
  - **[options.state]** - State to query for from the server, not just restricted to the *US*
  - **[options.city]** - City to query for from the server, not just restricted to the *US*

- **[callback]** - Optional callback which is called with the same data as the promise, with the error (if any) as the first argument and the information as the second argument

**Note:** You cannot use the zip code with the state and city.  You either use the zip code or the state and city combination.

**Note:** Longer postal codes (example *L6A0X9* in Canada) will be truncated to *L6A* for you.  You don't have to truncate yourself.  Shorter postal codes will trigger an error.

## Contributing

This project was built using Babel Stage 0. I am open to anyone who wishes to fork the project and create new test cases, add useful functionality, or anything else. I use this project in my own work so I will be adding to this library as functionality arises that I need.

All I ask is that if you add functionality please provide the necessary test cases and try to get as high code coverage as possible.