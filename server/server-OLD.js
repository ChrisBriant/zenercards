var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var cors = require('cors');
var port = process.env.PORT || 8080;

var players = {};
var pairId = 0;
var pairs = [];

var cards = { 1:'circle',2:'square',3:'waves',4:'cross',5:'star'}

app.use(express.static(__dirname + '/public'));
app.use(cors());


// Function to generate random number
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


io.on('connection', function (socket) {
  console.log('a user connected: ', socket.id);
  //send the id
  io.to(socket.id).emit('socketID',socket.id);

  socket.on('new_player',function (name,multiPlayer) {
    console.log("New Player");
    players[socket.id] = {id:socket.id,name:name,cards:[],results:[]};
    console.log(pairs);
    if(multiPlayer) {
      if(pairs.length > 0) {
        if(pairs[pairs.length-1].length > 0) {
          console.log("HERE");
          var otherPlayer = pairs[pairs.length-1][0];
          console.log(otherPlayer);
          pairs[pairs.length-1].push(players[socket.id]);
          io.to(socket.id).emit('player_found',otherPlayer,false);
        } else {
          pairs.push([players[socket.id]]);
        }
      } else {
        pairs.push([players[socket.id]]);
      }
    }
  });

  socket.on('other_player_start', function (otherPlayer) {
    console.log(otherPlayer);
    io.to(socket.id).emit('player_found',otherPlayer,true);
  });

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    delete players[socket.id];
  });

  socket.on('draw_card', function (id) {
    //Randomly select the card and signal when ready
    var cardNo = randomNumber(1,6);
    players[id].cards.push(cardNo);
    io.to(id).emit('card_drawn');
    console.log('card drawn')
  });

  socket.on('guess_made', function (guess) {
    //Randomly select the card and signal when ready
    if(guess == players[socket.id].cards[-1]) {
      result = true;
    } else {
      result = false;
    }
    players[socket.id].results.push(result);
    io.to(socket.id).emit('guess_result',players[socket.id].cards[players[socket.id].cards.length-1]);
  });
});



// when players are paired, notify the players it is ready
io.on('player2Ready', function (player) {

});


server.listen(port, function(){
  console.log('listening on *:' + port);
});

setInterval(function() {
    //console.log(zombieData);
}, 500);
