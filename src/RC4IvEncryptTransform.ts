import RC4 from './RC4';
import * as crypto from 'crypto';
import { Transform, TransformCallback, TransformOptions } from 'stream';

export default class RC4IvEncryptTransform extends Transform {
    private _rc4: RC4;
    private _ivSize: number | boolean;

    constructor(key: Buffer | string, ivSize: number, transformOptions?: TransformOptions) {
        super(transformOptions);
        this._rc4 = new RC4(key);
        this._ivSize = ivSize || false;
    }

    _transform(chunk: Buffer | null, encoding: string, callback: TransformCallback): void {
        if (null === chunk) {
            return callback(null, null);
        }

        if (typeof this._ivSize === 'number' && this._ivSize > 0) {
            const key = crypto.randomBytes(this._ivSize);
            this.push(this._rc4.updateFromBuffer(Buffer.concat([key])));
            this._rc4 = new RC4(key);
            this._ivSize = false;
        }

        callback(null, this._rc4.updateFromBuffer(chunk));
    }
}
