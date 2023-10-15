import { IncomingMessage, ServerResponse } from "http";
import concatStream from "concat-stream";
import BufferHelper from "bufferhelper";
import zlib from "zlib";

/**
 * Modify the response
 * @param res The http response
 * @param contentEncoding {String} The http header content-encoding: gzip/deflate
 * @param callback {Function} Custom modified logic
 */
export default function brModifyResponse(
  res: ServerResponse<IncomingMessage>,
  callback,
) {
  // The cache response method can be called after the modification.
  let _write = res.write;
  let _end = res.end;
  let chunks = [];
  res.write = function (data, cb) {
    chunks.push(data);
  };

  res.end = function () {
    const compressedBuffer = Buffer.concat(chunks);
    // zlib.brotliDecompress(compressedBuffer, function (err, decompressedBuffer) {
    //   if (!err) {
    //     let body: string | Buffer = decompressedBuffer.toString();

    //     // Custom modified logic
    //     if (typeof callback === 'function') {
    //       body = callback(body);
    //     }
    //     body = Buffer.from(body as string);
    //     // console.log(decompressedData);
    //     _end.call(res);
    //   } else {
    //     console.error(err);
    //   }
    // });
  };
}
