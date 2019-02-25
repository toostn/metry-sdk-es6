# Unofficial ES6 SDK for metry.io API

**This SDK is still in early development. It should definitely not be used for
production code.**

This is the only "documentation" there is:

```
import {MetrySDK, MetryPrivateTokenAuthTransform} from 'metry-sdk-es6';

const baseURL = 'https://app.metry.io/api/v2';
const apiToken = '<private token>';
const auth = new MetryPrivateTokenAuthTransform(apiToken);
const metry = new MetrySDK(baseURL, auth);

// Changes my account's name to Mr. Robot
(async function () {
    let me = (await metry.resource('accounts').get('me')).data;
    console.dir(await metry.resource('accounts').save({'_id': me._id, name: 'Mr. Robot'}));
})();

// Returns the list of active meters
(async function () {
    console.dir(await metry.resource('meters').query({box: 'active'}));
})();

// So does this...
(async function () {
    console.dir(await metry.query('meters', {box: 'active'}));
})();

// You can either create a resource, like meters:
let Meters = metry.resource('meters');

// and use it like:
Meters.query({param: 'value'})

// or directly use:
metry.query('meters', {param: 'value'})

// To get time series data, like consumptions:
(async function () {
    console.dir(await metry.getTimeSeries('consumptions', '<meter id>', '<month|day|hour>', '<range, see metry api docs>'));
})();
```
