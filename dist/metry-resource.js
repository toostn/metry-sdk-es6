"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class MetryResource {
  constructor(resourceName, sdk, parentResourceName, parentResourceId) {
    this.resourceName = [parentResourceName, parentResourceId, resourceName].filter(p => p != null).join('/');
    this.sdk = sdk;
  }

  async get() {
    return this.sdk.get(this.resourceName, ...arguments);
  }

  async query() {
    return this.sdk.query(this.resourceName, ...arguments);
  }

  async save() {
    return this.sdk.save(this.resourceName, ...arguments);
  }

  async delete() {
    return this.sdk.delete(this.resourceName, ...arguments);
  }

  async getTimeSeries() {
    return this.sdk.getTimeSeries(this.resourceName, ...arguments);
  }

  of(parentResourceName, parentResourceId) {
    return new MetryResource(this.resourceName, this.sdk, parentResourceName, parentResourceId);
  }

}

exports.MetryResource = MetryResource;