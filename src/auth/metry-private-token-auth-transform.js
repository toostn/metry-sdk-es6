export class MetryPrivateTokenAuthTransform {
  constructor (privateToken) {
    this.privateToken = privateToken;
  }

  async transform (options) {
    return new Promise((resolve, reject) => {
      const headers = {
        'Authorization':  `Bearer ${this.privateToken}`,
        ...options.headers
      };

      resolve({
        ...options,
        headers
      });
    });
  }
}
