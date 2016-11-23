const rootURL = 'http://jservice.io/api/random';
var request = require('request')

function apiDetails(req, res, next){
  var options = {
    url: rootURL
  }
  var info = {};
  request(options.url, function(err, response, body){
  if (!err && response.statusCode == 200) {
    var data = JSON.parse(body)[0];
    info.category = data.category.title;
    info.answer = data.answer;
    info.question = data.question;
    res.json({info: info, success: true})
  } else {
    res.json(err);
  }

  });
};

function welcome(req, res, next) {
      res.render('homepage', { user: req.user });
}

function question (req, res, next) {
   res.json(require('../config/question'))
}

module.exports = {
  apiDetails: apiDetails,
  welcome: welcome,
  question: question
}
