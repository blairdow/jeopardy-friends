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

//get current question from sockets
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

  socket.on('right-answer', function(data){
    makeAnswer(data.answer, data.email)
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

  if (msgCheck.toLowerCase() == answerCheck.toLowerCase()) {
    console.log(userEmail + ' is the dawg now')

    socket.emit('right-answer', {
        answer: answer,
        email: userEmail
    })


    //send new question if answer is right
    setTimeout(function(){
        generateQuestion()
    }, 5000)

  }
}

//get question from API and send to socket
function generateQuestion() {
  $.get('/api/random').then(function(data) {
    var stripHTML = data.info.answer.replace(/<[^>]*>/g, "")
    var stripAns = stripHTML.replace(/[^a-zA-Z ]/g, "")

    question = {
      question: data.info.question,
      category: data.info.category,
      answer: stripAns
    }
    socket.emit('new-question', question)

  }, function(err) {console.error(err);})

}


//    function to send chat to socket
    function sendSocket(){
        if(newMsg.value.trim() !== "") {
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
          sendSocket();
      }
  })

  //send chat when send message is clicked
  $sendButton.on('click', function() {
    if(newMsg.value)
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


function makeAnswer(answer, email){
    $('#answer').append(
        `${answer} was correct! Good job ${email}. Next question coming up...`
    )
    setTimeout(function(){
        $('#answer').html('')
    }, 5000)
}
