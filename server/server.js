var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var cors = require('cors');
var port = process.env.PORT || 8080;

var players = {};
var pairId = 1;
var pairs = {};

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
    players[socket.id] = {id:socket.id,name:name,cards:[],results:[],pairId:0};
    console.log(pairs);
    if(multiPlayer) {
      if(pairId in pairs) {
        var otherPlayer = pairs[pairId][0];
        //Set the pair id
        players[socket.id].pairId = pairId;
        pairs[pairId].push(players[socket.id]);
        pairId++;
        io.to(socket.id).emit('player_found',otherPlayer,false);
      } else {
        players[socket.id].pairId = pairId;
        pairs[pairId] = [players[socket.id]];
      }
    }
  });

  socket.on('other_player_start', function (otherPlayer) {
    console.log(otherPlayer);
    io.to(otherPlayer).emit('player_found',players[socket.id],true);
  });

  // when a player disconnects, remove them from our players object
  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
    if(players[socket.id].pairId > 0) {
      if(players[socket.id].pairId in pairs) {
        var pair = pairs[players[socket.id].pairId];
        if(pair.length > 1) {
          if(pair[0].id == socket.id) {
            var otherId = pair[1].id;
          } else {
            var otherId = pair[0].id;
          }
        }
        console.log("Other");
        console.log(otherId);
        io.to(otherId).emit('finished_game',players[socket.id],true);
        delete pairs[players[socket.id].pairId];
      }
      delete players[socket.id];
    } else {
      delete players[socket.id];
    }
  });

  socket.on('draw_card', function (id) {
    //Randomly select the card and signal when ready
    var cardNo = randomNumber(1,6);
    players[id].cards.push(cardNo);
    io.to(id).emit('card_drawn');
    console.log('card drawn')
  });

  socket.on('card_drawn',function(cardId,otherId) {
    console.log(socket.id);
    console.log(otherId);
    players[otherId].cards.push(cardId);
    io.to(otherId).emit('card_drawn');
    console.log('card drawn by player')
  });

  socket.on('guess_made', function (guess) {
    var cardId = players[socket.id].cards[players[socket.id].cards.length-1];
    //Randomly select the card and signal when ready
    if(guess == cardId) {
      result = true;
    } else {
      result = false;
    }
    players[socket.id].results.push(result);
    console.log('guess result');
    console.log(players[socket.id]);
    console.log(typeof players[socket.id].cards[-1]);
    console.log(typeof guess);
    io.to(socket.id).emit('guess_result',cardId);
  });

  socket.on('player_has_guessed', function (otherId) {
    var guessResult = players[socket.id].results[players[socket.id].results.length-1];;
    io.to(otherId).emit('draw_again',guessResult);
  });

  socket.on('turn_change', function (otherId) {
    console.log('turn change');
    io.to(otherId).emit('turn_change');
  });

  socket.on('multiplayer_finished', function (otherId,playerInitiated) {
    console.log('FINISHED');
    if(players[otherId].pairId in pairs) {
      delete pairs[players[otherId].pairId];
      console.log("pairs");
      console.log(pairs);
    }
    io.to(socket.id).emit('finished_game',players[otherId],playerInitiated);
    io.to(otherId).emit('finished_game',players[socket.id],playerInitiated);
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
