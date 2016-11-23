document.addEventListener("DOMContentLoaded", function() {
  var messages = document.getElementById('messages');
  var $chatroom = $('.chatroom')
  var newMsg = document.getElementById('new-msg');
  var userName = document.getElementById('user-name');
  var userEmail = document.getElementById('user-email').innerHTML;
  var $sendButton = $('#btn-send-msg')
  var answer;

  var socket = io();
  socket.on('add-message', function (data) {
    addMessage(data);
    scrollDown()
  });

//keep chatroom scrolled to the bottom
function scrollDown(){
    
    $('.chatroom').animate({ scrollTop: $(document).height() }, "slow");
    
    return false;
    
}   
        
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

setInterval(generateQuestion, 10000);


function checkAnswer(){
    console.log('answer: ', answer)
    console.log
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
  $sendButton.on('click', sendSocket);
  
  //send message with enter key  
  newMsg.addEventListener('keyup', function (event){
      if(event.which == 13) {
          sendSocket()
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

