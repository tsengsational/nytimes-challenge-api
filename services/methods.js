var methods = {
  alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  translate: function(word) {
    let returnedWord = ""
    word[0] === word[0].toUpperCase() ? returnedWord = "Boinga" : returnedWord = "boinga"
    return returnedWord
  },
  translatePunct: function(word) {
    // split word from punctuation, then replace the word with translated word,
    // rejoin word Array and return new Word with punctuation
    let wordArr =  word.match(/\w+|\s+|[^\s\w]+/g)
    wordArr = wordArr.map(chunk => {
      let returned = ""
      if (chunk.length > 1 && !methods.alphabet.includes(chunk)) {
        returned = methods.translate(chunk)
      } else {
        returned = chunk
      }
      return returned
    })
    let newWord = wordArr.join("");
    return newWord
  },
  martian: function(string) {
    let words = string.split(' ')
    let translatedWords = words.map( word => {
      if (word.length > 3) {
        if ( methods.hasPunctuation(word) ) {
          return methods.translatePunct(word)
        } else {
          return methods.translate(word)
        }
      } else {
        return word
      }
    })
    let translation = translatedWords.join(' ')
    return translation
  },
  flatten: function (arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? methods.flatten(toFlatten) : toFlatten);
    }, []);
  },
  hasPunctuation: function(word) {
    let characters = word.split('');
    let punctuation = methods.getPunctuation(characters);
    if ( punctuation.length > 0 ) {
      return true
    } else {
      return false
    };
  },
  getPunctuation: function(characters) {
    let punctuation = [];
    characters.forEach(character => {
      !methods.alphabet.includes(character) ? punctuation.push(character) : null
    });
    return punctuation
  },
  handleResp: (data, res) => {
    let json = JSON.parse(data)
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
    let payload = []
    articles.forEach( (article, index) => {
      let el = {
        english: article,
        martian: translatedArticles[index]
      }
      payload.push(el)
    })
    res.json(payload)
  }
}

module.exports = methods
