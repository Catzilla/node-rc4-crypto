import { RC4 } from './RC4';
import crypto from 'crypto';

export class RC4IvEncrypt {
    public _rc4: RC4;
    public _ivSize: number;

    constructor(key: Buffer | string, ivSize?: number) {
        this._rc4 = new RC4(key);
        this._ivSize = ivSize || 0;
    }

    update(data: Buffer | string): Buffer {
        if (!(data instanceof Buffer)) {
            data = Buffer.from ? Buffer.from(data) : new Buffer(data);
        }

        return this.updateFromBuffer(data);
    }

    updateFromBuffer(data: Buffer): Buffer {
        if (this._ivSize > 0) {
            const iv = crypto.randomBytes(this._ivSize);
            const ivEncrypted = this._rc4.updateFromBuffer(Buffer.concat([iv]));
            this._ivSize = 0;
            this._rc4 = new RC4(iv);

            return Buffer.concat([
                ivEncrypted,
                this._rc4.updateFromBuffer(data)
            ]);
        }

        return this._rc4.updateFromBuffer(data);
    }
}
