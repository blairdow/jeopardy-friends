document.addEventListener("DOMContentLoaded", function() {
  var messages = document.getElementById('messages');
  var $chatroom = $('.chatroom')
  var newMsg = document.getElementById('new-msg');
  var userName = document.getElementById('user-name');
  var userEmail = document.getElementById('user-email').innerHTML;
  var $sendButton = $('#btn-send-msg')
  var answer;
  var question

  var socket = io();
  socket.on('add-message', function (data) {
    addMessage(data);
    scrollDown()

  });

    socket.on('update-question', function(data){
      console.log('update')
      appendQuestion(data)
    })
  // socket.on('new-question', function(){
  //   generateQuestion();
  // }

//keep chatroom scrolled to the bottom
function scrollDown(){

    $('.chatroom').animate({ scrollTop: $(document).height() }, "slow");

    return false;

}

function appendQuestion(data){
  console.log('append question: ', data)
  $('#question').html("")
  $('#category').html("")
  $('#question').prepend(makeQuestion(data));
  $('#category').prepend(makeCategory(data));
  answer = data.answer
  console.log(answer)

}


setInterval(generateQuestion, 10000);


function checkAnswer(){
  var msgCheck = newMsg.value
  var answerCheck = answer
  console.log('msg: ', newMsg.value)
  console.log('answer: ', answer)
  if (msgCheck == answerCheck) {
    console.log('YOURE THE MAN NOW DAWG')
  }
}

function generateQuestion() {
  $.get('/api/random').then(function(data) {
    question = {
      question: data.info.question,
      category: data.info.category,
      answer: data.info.answer
    }
    socket.emit('new-question', question)

  }, function(err) {console.error(err);})
}


//    function to send chat to socket
    function sendSocket(){
        if(newMsg.value) {
            socket.emit('add-message', {
              name: userEmail,
              msg: newMsg.value
            });

              checkAnswer();
              newMsg.value = '';
              newMsg.focus()
        }
    }


  //send chat when send message is clicked
  $sendButton.on('click', function() {
    checkAnswer();
    sendSocket();
})

  //send message with enter key
  newMsg.addEventListener('keyup', function (event){
      if(event.which == 13) {
          checkAnswer();
          sendSocket();
      }
  })


  function addMessage(data) {
    var div = document.createElement('div')
    div.className = 'chat-message'
    div.innerHTML = `<span class="userEmail"> ${data.name} </span>: <span class="msg-content"> ${data.msg} </span>`
    $chatroom.append(div)
  }

});

function makeQuestion(obj) {
   return `
          <p>${obj.question}</p>
          `;
}

function makeCategory(obj) {
    return `<p>${obj.category}</p>`
}
