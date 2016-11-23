document.addEventListener("DOMContentLoaded", function() {
  var messages = document.getElementById('messages');
  var $chatroom = $('.chatroom')
  var newMsg = document.getElementById('new-msg');
  var userName = document.getElementById('user-name');
  var userEmail = document.getElementById('user-email').innerHTML;
  var $sendButton = $('#btn-send-msg')
  var answer;
  var question;

  var socket = io();

$.get('/currentquestion').then(function(data){
  appendQuestion(data)
})

//send chat
  socket.on('add-message', function (data) {
    addMessage(data);
    scrollDown()

  });

 //append question coming in from socket
  socket.on('update-question', function(data){
    appendQuestion(data)
  })

//keep chatroom scrolled to the bottom
function scrollDown(){
    $('.chatroom').animate({ scrollTop: $(document).height() }, "slow");
    return false;
}

//append question using socket data
function appendQuestion(data){
  $('#question').html("")
  $('#category').html("")
  $('#question').prepend(makeQuestion(data));
  $('#category').prepend(makeCategory(data));

  //set answer variable
  answer = data.answer
  console.log(answer)
}

//check answer
function checkAnswer(){
  var msgCheck = newMsg.value.trim()
  var answerCheck = answer
  // console.log('msg: ', newMsg.value)
  if (msgCheck == answerCheck) {
    console.log(userEmail + ' is the dawg now')

    //send new question if answer is right
    generateQuestion();
  }
}

//get question from API and send to socket
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


  //send message with enter key
  newMsg.addEventListener('keyup', function (event){
      if(event.which == 13) {
          checkAnswer();
          sendSocket();
      }
  })

  //send chat when send message is clicked
  $sendButton.on('click', function() {
    checkAnswer();
    sendSocket();
  })

//add message with socket data
  function addMessage(data) {
    var div = document.createElement('div')
    div.className = 'chat-message'
    div.innerHTML = `<span class="userEmail"> ${data.name} </span>: <span class="msg-content"> ${data.msg} </span>`
    $chatroom.append(div)
  }
});

// functions to format question data before appending
function makeQuestion(obj) {
   return `
          <p>${obj.question}</p>
          `;
}

function makeCategory(obj) {
    return `<p>${obj.category}</p>`
}