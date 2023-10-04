var httpProxy = require('http-proxy');
var modifyResponse = require('http-proxy-response-rewrite');
var proxy = httpProxy.createServer({
  target: 'target server IP here',
});

proxy.listen(8001);
proxy.on('error', function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong. And we are reporting a custom error message.');
});

proxy.on('proxyRes', function (proxyRes, req, res) {

  modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
    if (body && (body.indexOf("<process-order-response>") != -1)) {
      var beforeTag = "</receipt-text>"; //tag after which u can add data to 
      //       response
      var beforeTagBody = body.substring(0, (body.indexOf(beforeTag) + beforeTag.length));
      var requiredXml = " <ga-loyalty-rewards>\n" +
        "<previousBalance>0</previousBalance>\n" +
        "<availableBalance>0</availableBalance>\n" +
        "<accuruedAmount>0</accuruedAmount>\n" +
        "<redeemedAmount>0</redeemedAmount>\n" +
        "</ga-loyalty-rewards>";
      var afterTagBody = body.substring(body.indexOf(beforeTag) + beforeTag.length) +
     var res = [];
      res.push(beforeTagBody, requiredXml, afterTagBody);
      console.log(res.join(""));
      return res.join("");
    }
    return body;
  });
});