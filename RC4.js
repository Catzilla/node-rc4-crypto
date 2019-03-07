'use strict';

module.exports = class RC4 {
    /**
     * @param {Buffer|string} key
     */
    constructor(key) {
        if (!(key instanceof Buffer)) {
            key = Buffer.from(key);
        }

        let box = Buffer.alloc(0x100);
        let keylen = key.length;
        let l = 0;

        for (let k = 0; k < 0x100; ++k) {
            box[k] = k;
        }

        for (let k = 0; k < 0x100; ++k) {
            l = (l + box[k] + key[k % keylen]) % 0x100;
            let s = box[k];
            box[k] = box[l];
            box[l] = s;
        }

        this._box = box;
        this._i = 0;
        this._j = 0;
    }

    /**
     * @param {*} msg
     * @returns {Buffer}
     */
    update(msg) {
        if (!(msg instanceof Buffer)) {
            msg = Buffer.from(msg);
        }

        return this.updateFromBuffer(msg);
    }

    /**
     * @param {Buffer} msg
     * @returns {Buffer}
     */
    updateFromBuffer(msg) {
        for (let k = 0; k < msg.length; ++k) {
            let i = (this._i + 1) % 0x100;
            let j = (this._j + this._box[i]) % 0x100;
            let s = this._box[i];
            this._box[i] = this._box[j];
            this._box[j] = s;
            msg[k] ^= this._box[(this._box[i] + this._box[j]) % 0x100];
            this._i = i;
            this._j = j;
        }

        return msg;
    }

    /**
     * @param {number} n
     */
    skip(n) {
        for (let k = 0; k < n; ++k) {
            let i = (this._i + 1) % 0x100;
            let j = (this._j + this._box[i]) % 0x100;
            let s = this._box[i];
            this._box[i] = this._box[j];
            this._box[j] = s;
            this._i = i;
            this._j = j;
        }
    }
};
