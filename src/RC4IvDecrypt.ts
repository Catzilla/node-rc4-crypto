import { RC4 } from './RC4';

export class RC4IvDecrypt {
    public _iv: Buffer;
    public _rc4: RC4;
    public _ivSize: number;

    constructor(key: Buffer | string, ivSize?: number) {
        this._rc4 = new RC4(key);
        this._ivSize = ivSize || 0;
        this._iv = Buffer.allocUnsafe ? Buffer.allocUnsafe(0) : new Buffer(0);
    }

    update(data: Buffer | string): Buffer {
        if (!(data instanceof Buffer)) {
            data = Buffer.from ? Buffer.from(data) : new Buffer(data);
        }

        return this.updateFromBuffer(data);
    }

    updateFromBuffer(data: Buffer): Buffer {
        if (this._ivSize > 0) {
            const length = Math.min(this._ivSize, data.length);
            this._iv = Buffer.concat([this._iv, this._rc4.updateFromBuffer(data.slice(0, length))]);
            this._ivSize -= length;

            if (this._ivSize) {
                return Buffer.allocUnsafe ? Buffer.allocUnsafe(0) : new Buffer(0);
            }

            this._rc4 = new RC4(this._iv);
            return this._rc4.updateFromBuffer(data.slice(length));
        }

        return this._rc4.updateFromBuffer(data);
    }
}
