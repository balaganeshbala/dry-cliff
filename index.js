const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const NodeRSA = require('node-rsa');

const privateKeyHyperBeta = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA2R+5+b1HZSNNMotnr7Z/5By4NSTZW4dDMGDy2huOSLn1EF6v
75sssdY5kRkFoihLIeNQA+yzsi0kzpz3rCCCmo1DJwgoqA48JVQwwBjZ9SHeC0nE
66VODmMJJGNWe1quHWQb3otIzS+U+rtd1Alzo9up8u8e+FrecyjO6fBMZfd32iO7
qPtExtA1XDtKMqoRbHMiAz940xA5+BLmJC+gp1IYsVce2KA5BW1laPxbku42aQR7
eZipSa3BYRY8m964Aj6vLj4kTeTbrc4OH7yatRdWbVbrwVWpg936g8Q3Qf3jQY+H
Mu76l1WeXK4GkPkA+oJXY6ag1XhhqtOrLw3rJwIDAQABAoIBAQCjy2thG4lgouD5
4HC3/dU9IO1WKhZPFht5w6lxIJiWBLL7RnMzLrzo69NBwr6dNgh36CPU0hw9rhC2
TXQKRfxA25BtQZpqLVLyVjDwuc6zPnljyqLjojDgaZXb/ZSgOihfw8XCfRDOubaJ
8A84hmjWlEABJKMYeHSYK5Dsqnr37/Oj4OT2NWLaRx8Kk0HPuv/bxx3MHurIHRtG
514UJZcOfN8Ti69/DoYbtb/Mpg/djXr5s47TafxPa8jyT2E8nWboPvYPDQcdu2CI
E0mbrj2C0Ak7g20ZYzm9HCbJHVG+2rPSjVgXKW2ZgXoZflte+G5vRfDrZH+TZuo+
ja0pVlIBAoGBAP4ZEtdpRJp5kvj7bUIkXd5E6lrxd2M0VprfMhHk0i+Z1p1nF8St
F6p9uIGuRIEthvdRZVy56fWCHXOfmquRJDHazQZVnnXcRaqhuMYdZoJ3i1KkmSL4
X/SdBsB4rY4FQZWNtwKoSeDugQeJzf4bhyn0iZGbWPq+XO70MxXya8CfAoGBANq/
zL6ul+G6i/nXrfzwUr83EtXh6Zoj51YBK4g3ZIIuWkWvbo9NguV3p9KmeRKMWwYO
RHC7aVwpHdjzOyzmSFdmC+5dqVe6rkdl9AzxpKt0p0rOznmZUhDcdElCk0p6pC5R
QDAt2PA4aR3kT+9z2dPV0IHsUGiouF/LtmTmdCB5AoGAIShUdRefhCjpLORiVYc5
WI/VpRhtY9yokH0fo4Ygh2Wjw9Z4G4oa1HyjXwjGl7TBL/THLVp1VTwta7EgFdNS
zc6ngnQZwXeE/8cqvW+IuO2wmJAyC4Ytv1XeU69rtmSpMkLT5tzfByMYY0twPgCJ
msf2S7Hh4paEugnTwMFpnjECgYEAoTqc/i5RY97LLOr7ImM/mhBNobdRJnswFwPl
whCR1CG2B4a2Rokq4VbAK1LoCfPJYz1A1JZNoc/sX+tmwkE5MLHWOWpvVmoR6i4L
Iz83z+e7JjgnlxialDLowtZ/GXYrbLgWR2yDaQsq7w1InYUWGDyP4jL7USiKPJE5
bkUtcoECgYEAwhbb1NxzteIr8zlytMj52sgeiJPQRjbU5CoMAJuiHvYHT8jQwso7
lfbz+fXdQamU29v1Hdhc2JR1xWxrTz4bAt1l9lWK8zQBTK3SOlhyvrvNkKtTwjan
sR6+uwB9KY5mrF++pRA8IL2f0yhx2uqwDkX/Og6ZnFHJn3BvQM/DWPg=
-----END RSA PRIVATE KEY-----`

const publicKeyHyperBeta = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2R+5+b1HZSNNMotnr7Z/
5By4NSTZW4dDMGDy2huOSLn1EF6v75sssdY5kRkFoihLIeNQA+yzsi0kzpz3rCCC
mo1DJwgoqA48JVQwwBjZ9SHeC0nE66VODmMJJGNWe1quHWQb3otIzS+U+rtd1Alz
o9up8u8e+FrecyjO6fBMZfd32iO7qPtExtA1XDtKMqoRbHMiAz940xA5+BLmJC+g
p1IYsVce2KA5BW1laPxbku42aQR7eZipSa3BYRY8m964Aj6vLj4kTeTbrc4OH7ya
tRdWbVbrwVWpg936g8Q3Qf3jQY+HMu76l1WeXK4GkPkA+oJXY6ag1XhhqtOrLw3r
JwIDAQAB
-----END PUBLIC KEY-----`


var _verifyRSASignature = function(payload, signature, publicKey) {
  const decryptionKey = new NodeRSA(publicKey);
  var result = decryptionKey.verify(payload, signature, "utf8", "base64");
  return result;
}

var app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))

app.get('/sign-hyper-beta', (req, res) => {
  var payload = req.query.payload;

  console.log("Payload :", payload);

  const encryptKey = new NodeRSA(privateKeyHyperBeta);
  var result = encryptKey.sign(payload,'base64','utf8');
  console.log(result);
  res.send(result);
})

app.get('/verify-hyper-beta', (req, res) => {
  var payload = req.query.payload;
  var signature = req.query.signature;

  var result = _verifyRSASignature(payload, signature, publicKeyHyperBeta);
  res.send(result);
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
