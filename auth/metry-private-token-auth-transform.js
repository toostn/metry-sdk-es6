export class MetryPrivateTokenAuthTransform {
    constructor (privateToken) {
        this.privateToken = privateToken;
    }

    async transform (request) {
        return new Promise((resolve, reject) => {
            request.headers.append('Authorization', `Bearer ${this.privateToken}`);
            resolve(request);
        });
    }
}