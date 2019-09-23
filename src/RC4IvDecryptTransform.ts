import { RC4IvDecrypt } from './RC4IvDecrypt';
import { Transform, TransformCallback, TransformOptions } from 'stream';

export class RC4IvDecryptTransform extends Transform {
    private _rc4: RC4IvDecrypt;

    constructor(key: Buffer | string, ivSize?: number, transformOptions?: TransformOptions) {
        super(transformOptions);
        this._rc4 = new RC4IvDecrypt(key, ivSize);
    }

    _transform(chunk: Buffer | null, encoding: string, callback: TransformCallback): void {
        if (null === chunk) {
            return callback(null, null);
        }

        callback(null, this._rc4.updateFromBuffer(chunk));
    }
}
