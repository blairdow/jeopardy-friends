document.addEventListener("DOMContentLoaded", function() {
  var messages = document.getElementById('messages');
  var newMsg = document.getElementById('new-msg');
  var userName = document.getElementById('user-name');
  var userEmail = document.getElementById('user-email').innerHTML;
  var answer;

  var socket = io();
  socket.on('add-message', function (data) {
    addMessage(data);
  });

function generateQuestion(){
  $.get('/api/random').then(function(data) {
  $('#question').html("")
  $('#category').html("")
  $('#question').prepend(makeQuestion(data.info));
  $('#category').prepend(makeCategory(data.info));
  answer = data.info.answer
  console.log(answer)
  }, function(err) {console.error(err);})
}

setInterval(generateQuestion, 15000);


function checkAnswer(){
    console.log('answer: ', answer)
    var msg = $('.msg-content')
    var name = $('.username')

  for (var i = 0; i < msg.length; i++){
    if (answer == msg[i].innerHTML) {
       name = msg[i].previousElementSibling.innerHTML
      console.log(name + ' WAS CORRECT!')
    } else {
      console.log('KEEP GUESSING')
    }
  }
}

  document.getElementById('btn-send-msg').addEventListener('click', function() {
    socket.emit('add-message', {
      name: userEmail,
      msg: newMsg.value
    });
      checkAnswer();
    newMsg.value = '';
  });

  function addMessage(data) {

    messages.innerHTML += ['<li class="chat-message"><span class="userEmail">', data.name, '</span>: <span class="msg-content">', data.msg, '</span></li>'].join('');

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

