'use strict';

class RC4 {
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
            msg = new Buffer.from(msg);
        }

        return this.updateFromBuffer(msg);
    }

    /**
     * @param {Buffer} msg
     * @returns {Buffer}
     */
    updateFromBuffer(msg) {
        let msglen = msg.length;
        let box = this._box;

        for (let k = 0; k < msglen; ++k) {
            let i = (this._i + 1) % 0x100;
            let j = (this._j + this._box[i]) % 0x100;
            let s = box[i];
            box[i] = box[j];
            box[j] = s;
            msg[k] ^= box[(box[i] + box[j]) % 0x100];
            this._i = i;
            this._j = j;
        }

        return msg;
    }

    /**
     * @param {number} n
     */
    skip(n) {
        let box = this._box;

        for (let k = 0; k < n; ++k) {
            let i = (this._i + 1) % 0x100;
            let j = (this._j + this._box[i]) % 0x100;
            let s = box[i];
            box[i] = box[j];
            box[j] = s;
            this._i = i;
            this._j = j;
        }
    }
}

module.exports = RC4;
