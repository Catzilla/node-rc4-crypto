import RC4 from './RC4';
import { Transform, TransformCallback, TransformOptions } from 'stream';

export default class RC4Transform extends Transform {
    private _rc4: RC4;

    constructor(key: Buffer | string, transformOptions?: TransformOptions) {
        super(transformOptions);
        this._rc4 = new RC4(key);
    }

    _transform(chunk: Buffer | null, encoding: string, callback: TransformCallback): void {
        callback(null, null === chunk ? null : this._rc4.updateFromBuffer(chunk));
    }
}
