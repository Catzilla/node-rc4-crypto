import { Buffer } from 'buffer';

export default class RC4 {
    private _i: number = 0;
    private _j: number = 0;
    private _box: Buffer = Buffer.alloc ? Buffer.alloc(0x100) : new Buffer(0x100);

    constructor(key: Buffer | string) {
        if (!(key instanceof Buffer)) {
            key = Buffer.from ? Buffer.from(key) : new Buffer(key);
        }

        const keylen = key.length;
        let l = 0;

        for (let k = 0; k < 0x100; ++k) {
            this._box[k] = k;
        }

        for (let k = 0; k < 0x100; ++k) {
            l = (l + this._box[k] + key[k % keylen]) % 0x100;
            let s = this._box[k];
            this._box[k] = this._box[l];
            this._box[l] = s;
        }
    }

    update(msg: Buffer | string): Buffer {
        if (!(msg instanceof Buffer)) {
            msg = Buffer.from ? Buffer.from(msg) : new Buffer(msg);
        }

        return this.updateFromBuffer(msg);
    }

    updateFromBuffer(msg: Buffer): Buffer {
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

    skip(n: number): void {
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
}
