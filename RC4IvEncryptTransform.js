'use strict';

const RC4 = require('./RC4');
const crypto = require('crypto');
const { Transform } = require('stream');

module.exports = class RC4IvEncryptTransform extends Transform {
    /**
     * @param {Buffer|string} key
     * @param {number} ivSize
     */
    constructor(key, ivSize) {
        super();
        this._rc4 = new RC4(key);
        this._ivSize = ivSize || false;
    }

    /**
     * @param {Buffer} chunk
     * @param {string} encoding
     * @param {Function} callback
     * @private
     */
    _transform(chunk, encoding, callback) {
        if (null === chunk) {
            return callback(null, null);
        }

        if (this._ivSize) {
            const key = crypto.randomBytes(this._ivSize);
            this.push(this._rc4.updateFromBuffer(Buffer.concat([key])));
            this._rc4 = new RC4(key);
            this._ivSize = false;
        }

        callback(null, this._rc4.updateFromBuffer(chunk));
    }
};
