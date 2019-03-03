"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetrySDK = undefined;

var _metryResource = require("./metry-resource.js");

var _makeUrl = require("./util/make-url.js");

const BASE_URL_DEFAULT = 'https://app.metry.io/api/v2';
const HEADER_JSON = {
  'Content-Type': 'application/json'
};
const TIMESERIES_METRIC_DEFAULT = 'energy';

class MetrySDK {
  constructor(baseURL = BASE_URL_DEFAULT, authTransform, httpClient) {
    this.authTransform = authTransform;
    this.baseURL = baseURL;
    this.httpClient = httpClient;

    if (this.httpClient == null && typeof window !== "undefined" && 'fetch' in window) {
      this.httpClient = fetch.bind(window);
    }
  }

  resource(resourceName) {
    return new _metryResource.MetryResource(resourceName, this);
  }

  async get(resourceName, resourceId, options) {
    return this.request([resourceName, resourceId], undefined, options);
  }

  async query(resourceName, params, options) {
    return this.request(resourceName, params, options);
  }

  async save(resourceName, resourceObject, options = {}) {
    const {
      _id,
      ...body
    } = resourceObject;
    const requestOptions = {
      method: _id != null ? 'PUT' : 'POST',
      body: JSON.stringify(body),
      headers: { ...HEADER_JSON,
        ...options.headers
      }
    };
    return this.request([resourceName, _id], undefined, { ...requestOptions,
      ...options
    });
  }

  async delete(resourceName, resourceId, options = {}) {
    return this.request([resourceName, resourceId], undefined, {
      method: 'DELETE',
      ...options
    });
  }

  async getTimeSeries(resourceName, objectId, granularity, ranges, metrics = TIMESERIES_METRIC_DEFAULT, options = {}) {
    ranges = Array.isArray(ranges) ? ranges.join('+') : ranges;
    metrics = Array.isArray(metrics) ? metrics.join(',') : metrics;
    return this.request([resourceName, objectId, granularity, ranges], {
      metrics
    }, options);
  }

  async request(pathComponents, params = {}, options = {}) {
    pathComponents = !Array.isArray(pathComponents) ? [pathComponents] : pathComponents;
    const url = (0, _makeUrl.makeUrl)([this.baseURL, ...pathComponents], params);
    const authorizedOptions = await this.authTransform.transform(options);
    return this.httpClient(url, authorizedOptions).then(async res => {
      return res.ok === false ? Promise.reject(res) : this._parseResponse(res);
    });
  }

  async _parseResponse(response) {
    const json = await response.json();
    return 'data' in json && !('count' in json) ? json.data : json;
  }

}

exports.MetrySDK = MetrySDK;