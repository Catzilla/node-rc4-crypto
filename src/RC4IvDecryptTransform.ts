import RC4 from './RC4';
import { Transform, TransformCallback, TransformOptions } from 'stream';

export default class RC4IvDecryptTransform extends Transform {
    private _rc4: RC4;
    private _ivSize: number | boolean;
    private _iv: Buffer = Buffer.alloc ? Buffer.alloc(0) : new Buffer(0);

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
            const length = Math.min(this._ivSize, chunk.length);
            this._iv = Buffer.concat([this._iv, this._rc4.updateFromBuffer(chunk.slice(0, length))]);
            this._ivSize -= length;

            if (this._ivSize) {
                return callback();
            }

            this._rc4 = new RC4(this._iv);
            chunk = chunk.slice(length);
            this._iv = Buffer.alloc ? Buffer.alloc(0) : new Buffer(0);
            this._ivSize = false;
        }

        callback(null, this._rc4.updateFromBuffer(chunk));
    }
}
