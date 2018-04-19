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
      let json = JSON.parse(dataSlice)
      let articles = []
      json.page.content.forEach(content => {
        content.collections.forEach(collection => {
          let collArticles = collection.assets.filter(asset => asset.type === "Article")
          articles.push(collArticles)
        })
      })
      articlesFlat = methods.flatten(articles)
      articles = articlesFlat.map( article => {
        newArticle = {
          type: article.type,
          headline: article.headline,
          byline: article.byline,
          url: article.url,
          summary: article.summary,
          images: article.images
        }
        return newArticle
      })
      translatedArticles = articles.map(article => {
        transArticle = {
          type: article.type,
          headline: methods.martian(article.headline),
          byline: methods.martian(article.byline),
          url: article.url,
          summary: methods.martian(article.summary),
          images: article.images
        }
        return transArticle
      })
      let payload = {
        english: articles,
        martian: translatedArticles
      }
      res.send(payload)
    });
  });
});

module.exports = router
