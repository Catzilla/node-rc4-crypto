'use strict';

const RC4 = require('./RC4');
const { Transform } = require('stream');

class RC4Transform extends Transform {
    /**
     * @param {Buffer|string} key
     */
    constructor(key) {
        super();
        this._rc4 = new RC4(key);
    }

    /**
     * @param {Buffer} chunk
     * @param {string} encoding
     * @param {Function} callback
     * @private
     */
    _transform(chunk, encoding, callback) {
        callback(null, null === chunk ? null : this._rc4.updateFromBuffer(chunk));
    }
}

module.exports = RC4Transform;
