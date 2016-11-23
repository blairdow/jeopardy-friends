var io = require('socket.io')();
var request = require('request')
const rootURL = 'http://jservice.io/api/random';

var setQuestion = {}

request(rootURL, function(err, response, body){
if (!err && response.statusCode == 200) {
  var data = JSON.parse(body)[0];

  setQuestion.category = data.category.title
  setQuestion.answer = data.answer
  setQuestion.question = data.question

  console.log(setQuestion)
  }
})

io.on('connection', function(socket){

  socket.on('new-question', function(data){
    setQuestion = data
  })

})

module.exports = setQuestion
