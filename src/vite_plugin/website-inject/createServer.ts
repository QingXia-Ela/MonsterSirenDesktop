import { writeFileSync } from "fs";
import Server from "http-proxy";
import modifyResponse from "http-proxy-response-rewrite";
import zlib from "zlib";
// import brModifyResponse from './modifyResponse/br'

const cdnOptions = {
  target: "https://web.hycdn.cn",
  // rewrite: (path) => path.replace(/^\/cdn_proxy/, ""),
  changeOrigin: true,
  headers: {
    referer: "https://monster-siren.hypergryph.com",
  },
} as Server.ServerOptions;
const cdnProxy = Server.createProxyServer(cdnOptions);
cdnProxy.on("proxyRes", (proxyRes, req, res) => {
  if (req.url.includes(".js") || req.url.includes(".css")) {
    modifyResponse(res, "gzip", function (body) {
      const str = body
        .replaceAll("web.hycdn.cn", "localhost:11451")
        .replaceAll("https", "http")
        .replaceAll("/api/", "http://localhost:11452/")
        // log store change
        .replaceAll(
          "return function(n){if",
          "return function(n){console.log(n);if",
        )
        // inject store to global
        .replace("this.store=e,", "this.store=e,window.siren_store=e,");

      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Length", Buffer.byteLength(str));
      return str;
    });
  }
});
// cdnProxy.listen(11451)

const apiOptions = {
  target: "https://monster-siren.hypergryph.com/api",
  changeOrigin: true,
  headers: {
    referer: "https://monster-siren.hypergryph.com",
  },
} as Server.ServerOptions;
const apiProxy = Server.createProxyServer(apiOptions);
apiProxy.on("proxyRes", (proxyRes, req, res) => {
  console.log(req.url);
  res.setHeader("Access-Control-Allow-Origin", "*");
  let chunks = [];
  let _write = res.write;
  let _end = res.end;
  res.write = function (data, cb) {
    chunks.push(data);
  };

  res.end = function () {
    // br buffer
    if (proxyRes.headers["content-encoding"]) {
      const compressedBuffer = Buffer.concat(chunks);
      zlib.brotliDecompress(
        compressedBuffer,
        function (err, decompressedBuffer) {
          if (!err) {
            let body: string | Buffer = decompressedBuffer.toString();

            body = body
              .replaceAll("web.hycdn.cn", "localhost:11451")
              .replaceAll("https", "http");

            res.setHeader(
              "Content-Encoding",
              proxyRes.headers["content-encoding"],
            );

            _write.call(res, zlib.brotliCompressSync(body));
            _end.call(res);
          } else {
            console.error(err);
          }
        },
      );
    }
    // normal response
    else {
      let body = Buffer.concat(chunks)
        .toString()
        .replaceAll("web.hycdn.cn", "localhost:11451")
        .replaceAll("https", "http");
      res.setHeader("Content-Length", Buffer.byteLength(body));

      _write.call(res, body);
      _end.call(res);
    }
  };
});
// apiProxy.listen(11452)

export default cdnProxy;
