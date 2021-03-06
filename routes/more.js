var express = require('express');
var router = express.Router();
var http = require('http');
var methods = require('../services/methods')

router.get('/', function(req, res, next) {
  http.get('http://np-ec2-nytimes-com.s3.amazonaws.com/dev/test/nyregion.js', (resp)=> {
    let data = ''
    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      let dataSlice = data.slice(26, (data.length - 2))
      methods.handleResp(dataSlice, res)
    });
  });
});

router.all('/', function (req, res) {
  res.status(403).send("Can't do that, sorry! Only GETs permitted.")
})

module.exports = router
