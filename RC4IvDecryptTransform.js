'use strict';

const RC4 = require('./RC4');
const { Transform } = require('stream');

module.exports = class RC4IvDecryptTransform extends Transform {
    /**
     * @param {Buffer|string} key
     * @param {number} ivSize
     */
    constructor(key, ivSize) {
        super();
        this._rc4 = new RC4(key);
        this._ivSize = ivSize || false;
        this._iv = Buffer.alloc(0);
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
            const length = Math.min(this._ivSize, chunk.length);
            this._iv = Buffer.concat([this._iv, this._rc4.updateFromBuffer(chunk.slice(0, length))]);
            this._ivSize -= length;

            if (this._ivSize) {
                return callback();
            }

            this._rc4 = new RC4(this._iv);
            chunk = chunk.slice(length);
            this._iv = Buffer.alloc(0);
            this._ivSize = false;
        }

        callback(null, this._rc4.updateFromBuffer(chunk));
    }
};
