var express = require('express');
var router = express.Router();
var http = require('http');
var methods = require('../services/methods')

router.get('/', function(req, res, next) {
  http.get('http://np-ec2-nytimes-com.s3.amazonaws.com/dev/test/nyregion2.js', (resp)=>{
    let data = ''
    resp.on('data', (chunk) => {
      data += chunk;
    });



    resp.on('end', () => {
      let json = JSON.parse(data)
      let articles = []
      json.page.content.forEach(content => {
        content.collections.forEach(collection => {
          let collArticles = collection.assets.filter(asset => asset.type === "Article")
          articles.push(collArticles)
        })
      })
      articles = methods.flatten(articles)
      res.send(articles)
    });
  })
});


module.exports = router;
