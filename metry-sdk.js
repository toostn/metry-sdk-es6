import {MetryResource} from './metry-resource.js';
import {makeUrl} from './util/make-url.js';

const BASE_URL_DEFAULT = 'https://app.metry.io/api/v2';
const HEADER_JSON = {'Content-Type': 'application/json'};
const TIMESERIES_METRIC_DEFAULT = 'energy';

export class MetrySDK {
    constructor (baseURL = BASE_URL_DEFAULT, authTransform, httpClient) {
        this.authTransform = authTransform;
        this.baseURL = baseURL;
        this.httpClient = httpClient;

        if (this.httpClient == null &&  typeof window !== "undefined" && 'fetch' in window) {
            this.httpClient = fetch.bind(window);
        }
    }

    resource (resourceName) {
        return new MetryResource(resourceName, this);
    }

    async get (resourceName, resourceId, options) {
        return this.request([resourceName, resourceId], undefined, options);
    }
    
    async query (resourceName, params, options) {
        return this.request(resourceName, params, options);
    }
    
    async save (resourceName, resourceObject, options = {}) {
        const {_id, ...body} = resourceObject;
        const requestOptions = {
            method: _id != null ? 'PUT' : 'POST',
            body: JSON.stringify(body),
            headers: {...HEADER_JSON, ...options.headers}
        };

        return this.request(
            [resourceName, _id],
            undefined,
            {...requestOptions, ...options}
        );
    }

    async delete (resourceName, resourceId, options = {}) {
        return this.request(
            [resourceName, resourceId],
            undefined,
            {method: 'DELETE', ...options}
        );
    }

    async getTimeSeries (resourceName, objectId, granularity, ranges, metrics = TIMESERIES_METRIC_DEFAULT, options = {}) {
        ranges = Array.isArray(ranges) ? ranges.join('+') : ranges;
        metrics = Array.isArray(metrics) ? metrics.join(',') : metrics;

        return this.request(
            [resourceName, objectId, granularity, ranges],
            {metrics},
            options
        )
    }
    
    async request (pathComponents, params = {}, options = {}) {
        pathComponents = !Array.isArray(pathComponents) ? [pathComponents] : pathComponents;

        const url = makeUrl([this.baseURL, ...pathComponents], params);
        const request = new Request(url, options);
        const authorizedRequest = await this.authTransform.transform(request);
        
        return this.httpClient(authorizedRequest)
            .then(async (res) => {
                return (res.ok === false)
                    ? Promise.reject(res)
                    : this._parseResponse(res);
            });
    }

    async _parseResponse (response) {
        const json = await response.json();

        return ('data' in json && !('count' in json))
            ?  json.data
            : json;
    }
}