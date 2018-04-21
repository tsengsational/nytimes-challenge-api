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
    // split string into array of words, map words into new Array
    // if word has more than 3 characters and is not a number, translate word
    let words = string.split(' ')
    let translatedWords = words.map( word => {
      if ( word.length > 3 && methods.isNotNumber(word) ) {
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
    // recursively flatten array of any depth to depth of 1
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? methods.flatten(toFlatten) : toFlatten);
    }, []);
  },
  isNotNumber: function(word) {
    // remove commas from string, test if string is NaN
    word = word.replace(/\,/g,"")
    return isNaN(word)
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
    // parse JSON, traverse JSON and push all raw article objects into Array
    // parse raw article objects into new article objects with just info needed
    // created martian versions of new article objects
    // populate payload array with objects containing both english and martian versions
    // send JSON response
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
