"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

class MetryPrivateTokenAuthTransform {
  constructor(privateToken) {
    this.privateToken = privateToken;
  }

  async transform(options) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Authorization': `Bearer ${this.privateToken}`,
        ...options.headers
      };
      resolve({ ...options,
        ...headers
      });
    });
  }

}

exports.MetryPrivateTokenAuthTransform = MetryPrivateTokenAuthTransform;