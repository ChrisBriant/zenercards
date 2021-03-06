import React, { Component } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import NumericInput from 'react-numeric-input';
import WaitCircle from './waitcircle.js';
import { animateScroll } from "react-scroll";
import socketIOClient from "socket.io-client";

import circle from '../assets/circle.svg';
import square from '../assets/square.svg';
import waves from '../assets/waves.svg';
import cross from '../assets/cross.svg';
import star from '../assets/star.svg';
import back from '../assets/back.svg';
import tick from '../assets/check-circle-regular.svg';
import mistake from '../assets/times-circle-regular.svg';
import exit from '../assets/door-open-solid-wh.svg';
import placeholder from '../assets/placeholder.svg';

const ENDPOINT = "https://zener-card-server.herokuapp.com/";

class ZenerMain extends Component {

  constructor(props) {
    super(props);
    if(this.props.multiPlayer) {
      var turns = 2;
    } else {
      var turns = 1;
    }
    this.state = {
      name: "",
      isStart: true,
      cardsDisabled: true,
      isFinished: false,
      numberOfCards: 25,
      drawCount: 0,
      connected: false,
      cardDrawn: false,
      guessMade: false,
      drawReady: true,
      otherPlayerFound: false,
      playerPickedCard: false,
      playerPick: false,
      cardMessage: "Click draw card to select the first card from the server",
      turns: turns,
      otherPlayerVerdict:null,
      results: []
    }
    this.clickCard = this.clickCard.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.handleChangeCardCount = this.handleChangeCardCount.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.goToHome = this.goToHome.bind(this);
    this.initGame = this.initGame.bind(this);
    this.finish = this.finish.bind(this);
    this.getCardName = this.getCardName.bind(this);
    this.getVerdict = this.getVerdict.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
  }


  getCardName(id) {
    if(id === 0) {
      return back;
    }else if(id === 1) {
      return circle;
    }else if(id === 2) {
      return square;
    }else if(id === 3) {
      return waves;
    }else if(id === 4) {
      return cross;
    }else if(id === 5) {
      return star;
    } else if(id === 6) {
      return placeholder;
    }
  }

  componentDidMount(){
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "resultpanel"
    });
  }

  initGame() {
    var component = this;
    this.socket = socketIOClient.connect(ENDPOINT);

    this.socket.on('socketID', function() {
      this.emit('new_player',component.state.name,component.props.multiPlayer);
      if(!component.props.multiPlayer) {
        component.setState({connected:true});
      }
    });

    this.socket.on('player_found', function(otherPlayer,drawReady) {
      component.setState({playerPick:drawReady, connected:true, otherPlayer:otherPlayer,otherPlayerFound:true});
      if(component.state.playerPick) {
        var cardMessage = "Choose a card, try and transmit that image to " + component.state.otherPlayer.name;
        var cardsDisabled = false;
      } else {
        var cardMessage = "Please wait for " + component.state.otherPlayer.name + " to select a card";
        var cardsDisabled = true;
      }
      component.setState({cardMessage:cardMessage, cardsDisabled:cardsDisabled});
      if(!drawReady) {
        //Signal to the server to start the other player
        this.emit('other_player_start',otherPlayer.id);
      }
    });

    this.socket.on('card_drawn', function() {
      if(component.props.multiPlayer) {
        var cardMessage = component.state.otherPlayer.name + " is transmitting the card shown turned over, select the image which appears in your head";
        component.setState({cardDrawn:true, cardsDisabled:false, cardMessage:cardMessage, guessMade:false, serverCard:component.getCardName(0)});
      } else {
        var cardMessage = "The server has selected a card, try to visualize that image and select a card when ready.";
        component.setState({cardDrawn:true, cardsDisabled:false, cardMessage:cardMessage, serverCard:component.getCardName(0)});
      }
    });

    this.socket.on('guess_result', function(cardNo) {
      if(parseInt(cardNo) === parseInt(component.state.selectedCardNo) )
      {
        var result = { card:component.getCardName(parseInt(cardNo)), result:true } ;
      } else {
        var result = { card:component.getCardName(parseInt(cardNo)), result:false } ;
      }
      var results = component.state.results;
      results.push(result);
      var drawCount = component.state.drawCount;
      if(component.props.multiPlayer) {
        drawCount++;
      }
      if(drawCount == component.state.numberOfCards) {
        if(component.state.turns === 1) {
          if(component.props.multiPlayer) {
            //Tell the server to finish up the game
            component.socket.emit('multiplayer_finished',component.state.otherPlayer.id,false);
          } else {
            //Exit
            component.socket.disconnect();
            var verdict = component.getVerdict(component.state.results.filter(r => r.result).length, component.state.results.length,true);
            component.setState({isFinished:true, serverCard:component.getCardName(parseInt(cardNo)), results:results,verdict:verdict});
          }
        } else {
          //var turns = component.state.turns;
          //Tell the server to change player and change state
          var cardMessage = "Please pick a card is now " + component.state.otherPlayer.name + "'s turn to receive";
          component.setState({cardDrawn:false,playerPick:true, cardMessage:cardMessage, serverCard:component.getCardName(parseInt(cardNo)), cardSelection:component.getCardName(6), results:results});
          component.socket.emit('turn_change',component.state.otherPlayer.id);
        }
      } else {
        if(component.props.multiPlayer) {
          //Tell server the player has guessed now let other player select
          if(result.result) {
            var cardMessage = "Correct! Please wait for " + component.state.otherPlayer.name + " to transmit a card.";
          } else {
            var cardMessage = "Incorrect! Please wait for " + component.state.otherPlayer.name + " to transmit a card.";
          }
          component.socket.emit('player_has_guessed',component.state.otherPlayer.id);
        } else {
          if(result.result) {
            var cardMessage = "Correct! Please draw another card";
          } else {
            var cardMessage = "Incorrect! Please draw another card";
          }
        }
        component.setState({cardDrawn:true, cardsDisabled:true, cardMessage:cardMessage, drawReady:true, drawCount:drawCount, serverCard:component.getCardName(parseInt(cardNo)), results:results});
      }
    });

    this.socket.on('draw_again', function(result) {
      //Allow the player to draw another card
      if(result) {
        var cardMessage = component.state.otherPlayer.name + " guessed Correctly! Please pick another card";
      } else {
        var cardMessage = component.state.otherPlayer.name + " guessed Incorrectly! Please pick another card";
      }
      component.setState({playerPickedCard:false, cardsDisabled:false, cardMessage:cardMessage, cardDrawn:false});
    });

    this.socket.on('turn_change', function() {
      //Allow the player to draw another card
      var cardMessage = "It is now your turn to receive an image from " + component.state.otherPlayer.name;
      component.setState({playerPick:false, cardsDisabled:true, cardMessage:cardMessage,  cardSelection:component.getCardName(6), turns:1});
    });

    this.socket.on('finished_game', function(otherPlayer,playerInitiated) {
      //Allow the player to draw another card
      component.socket.disconnect();
      var verdict = component.getVerdict(component.state.results.filter(r => r.result).length, component.state.results.length,true);
      var otherResults = [];
      for(var i=0;i<otherPlayer.cards.length;i++) {
        otherResults.push({card:component.getCardName(parseInt(otherPlayer.cards[i])),result:otherPlayer.results[i]});
      }
      var otherPlayerVerdict = component.getVerdict(otherResults.filter(r => r.result).length,otherResults.length,false);
      component.setState({otherPlayer:otherPlayer,isFinished:true,playerDisconnect:playerInitiated,verdict:verdict,otherPlayerVerdict:otherPlayerVerdict,otherResults:otherResults});
    });
  }



  clickCard(e) {
    if(this.state.cardDrawn && !this.state.guessMade) {
      //Place the card in the middle and then request from the server
      this.setState({guessMade:true, cardSelection:this.getCardName(parseInt(e.target.id)), selectedCardNo:parseInt(e.target.id)});
      this.socket.emit('guess_made',e.target.id);
    } else if (this.props.multiPlayer && this.state.playerPick && !this.state.playerPickedCard) {
      //the player who is selecting gets to pick a card
      var cardMessage = "Focus on the image try and transmit that image to " + this.state.otherPlayer.name;
      this.setState({playerPickedCard:true, cardsDisabled:true, cardMessage:cardMessage, cardSelection:this.getCardName(parseInt(e.target.id)), selectedCardNo:parseInt(e.target.id)});
      this.socket.emit('card_drawn',e.target.id,this.state.otherPlayer.id);
    }
  }

  drawCard(e) {
    e.preventDefault();
    var drawCount = this.state.drawCount;
    drawCount++;
    this.setState({drawReady:false, guessMade:false, drawCount: drawCount});
    this.socket.emit('draw_card',this.socket.id);
  }

  handleChangeCardCount(e) {
    console.log(e);
    this.setState({numberOfCards:e});
  }

  handleChangeName(e) {
    this.setState({name:e.target.value});
  }

  handleStart() {
    this.setState({isStart:false});
    this.initGame();
  }

  finish() {
    if(this.props.multiPlayer) {
      //Rules for other player dropping out - decided to kick both off and show message
      this.socket.emit('multiplayer_finished',this.state.otherPlayer.id,true);
      this.setState({iDisconnected:true});
    } else {
      this.socket.disconnect();
      var verdict = this.getVerdict(this.state.results.filter(r => r.result).length, this.state.results.length,true);
      this.setState({isFinished:true,verdict:verdict});
    }
  }

  goToHome() {
    this.props.history.push('/')
  }

  getVerdict(totalCorrect,total,isMe) {
    var percentScore = (totalCorrect / total) * 100;
    if(isMe) {
      var person = "you have";
    } else {
      var person = this.state.otherPlayer.name + " has";
    }
    if(percentScore < 28) {
      return <p>{percentScore}%, this is within normal ranges, it is unlikely {person} ESP.</p>;
    } else if (percentScore > 28 && percentScore < 60) {
      return <p>{percentScore}%, this is much less probable, it indicates the possibility {person} ESP.</p>;
    } else if (percentScore > 60 && percentScore < 80) {
      return <p>{percentScore}%, this is a strong indicator that {person} ESP.</p>;
    } else if (percentScore > 80) {
      return <p>{percentScore}%, this score is extremely unlikely to happen by chance, almost certainly, {person} ESP.</p>;
    }
  }


  render() {
    if(!this.props.multiPlayer) {
      var selectedCard = <Col>{ !this.state.guessMade ? <img src={placeholder} alt="placeholder" className="card"/> : <img src={this.state.cardSelection} alt="placeholder" className="card"/> }</Col>;
    } else {
      var selectedCard = <Col>{ !this.state.guessMade && !this.state.playerPickedCard ? <img src={placeholder} alt="placeholder" className="card"/> : <img src={this.state.cardSelection}  alt="placeholder" className="card"/> }</Col>;
    }

    if(this.state.isFinished && this.props.multiPlayer && !this.state.playerDisconnect) {
      console.log(this.state.otherPlayer);
      //Produce a panel to show the other player results
      var otherResults = [];
      for(var i=0;i<this.state.otherPlayer.cards.length;i++) {
        otherResults.push({card:this.getCardName(parseInt(this.state.otherPlayer.cards[i])),result:this.state.otherPlayer.results[i]});
      }
      var otherPlayerResults =  <Col><div className="resultpanel">{ otherResults.map( (result,idx) => (
                                  <Row key={idx}>
                                    <Col><img alt="card" src={result.card}></img></Col>
                                    <Col>
                                      { !result.result ? <img src={mistake} alt="cross" className="iconsmall"></img> : <img src={tick} alt="tick" className="iconsmall"></img>  }
                                    </Col>
                                  </Row>
                                ))}</div></Col>
      var otherPlayerScore = <Col>{otherResults.filter(r => r.result).length}  /  { otherResults.length }</Col>
      var otherPlayerName = <Col>{this.state.otherPlayer.name}</Col>;
    } else {
      var otherPlayerName = <Row><Col></Col></Row>;
      var otherPlayerResults = <Col></Col>;
      var otherPlayerScore = <Col></Col>;
    }

    if(!this.props.multiPlayer) {
      var drawButton = <div>{this.state.connected && this.state.drawReady ? <Button variant="outline-warning" onClick={this.drawCard}>Draw Card</Button> : <Button variant="outline-warning" disabled>Draw Card</Button> }</div>
    } else {
      var drawButton = null;
    }

    if(this.state.isStart) {
      return (
        <Container>
          <Row>
            <Col>
              <label>Enter a nickname:</label>
            </Col>
            <Col>
              <input value={this.state.name} className="form-control" onChange={this.handleChangeName}/>
            </Col>
          </Row><br/>
          <Row>
            <Col md={6}>
              <label>Select number of tries:</label>
            </Col>
            <Col md={3}>
              <NumericInput min={1} max={100} value={this.state.numberOfCards} onChange={this.handleChangeCardCount}/>
            </Col>
            <Col md={3}></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col><p>25 is the recommended value, for the most accurate results, but you can change this to any number between 1 an 100</p></Col>
          </Row>
          <Row>
            <Col md={2}><Button onClick={this.handleStart}>START</Button></Col>
            <Col md={2}><Button onClick={this.goToHome}><img src={exit} alt="exit" className="iconsmall"></img> Exit</Button></Col>
          </Row>
        </Container>
      );
    } else if(this.state.isFinished && !this.state.playerDisconnect) {
      return (
        <Container>
          <Row>
            <Col><h4>Results:</h4></Col>
          </Row>
          <Row>
            <Col>{this.state.name}</Col>
          </Row>
          <Row>
            <Col>{this.state.results.filter(r => r.result).length}  /  { this.state.results.length } </Col>
          </Row>
          <Row>
            <Col>
              <div className="resultpanel">{ this.state.results.map( (result,idx) => (
                  <Row key={idx}>
                    <Col><img alt="card" src={result.card}></img></Col>
                    <Col>
                      { !result.result ? <img src={mistake} alt="cross" className="iconsmall"></img> : <img src={tick} alt="tick" className="iconsmall"></img>  }
                    </Col>
                  </Row>
                ))}
              </div>
            </Col>
          </Row>
          <br/>
          <Row><Col>{ this.state.verdict }</Col></Row>
          <Row>{ otherPlayerName }</Row>
          <Row>{ otherPlayerScore }</Row>
          <Row>{ otherPlayerResults }</Row>
          <br/>
          <Row><Col>{ this.state.otherPlayerVerdict }</Col></Row>
          <Row>
            <Col><Button onClick={this.goToHome}><img src={exit} alt="exit" className="iconsmall"></img> Exit</Button></Col>
          </Row>
        </Container>
      );
    } else if(this.state.isFinished && this.state.playerDisconnect) {
      return (
        <Container>
          <Row>
            <Col>
            { !this.state.iDisconnected ? <p>The other player has disconnected</p> : <p>You have disconnected</p> }
            <p>Both players must finish their round for scoring to happen.</p>
            </Col>
          </Row>
          <Row>
            <Col><Button onClick={this.goToHome}><img src={exit} alt="exit" className="iconsmall"/> Exit</Button></Col>
          </Row>
        </Container>
      );
    } else if(this.props.multiPlayer && !this.state.otherPlayerFound) {
      return (
        <Container>
          <Row>
            <Col></Col>
            <Col></Col>
            <h4>Waiting for other player</h4>
            <Col></Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col></Col>
            <Col><WaitCircle runAnim={true} speed={100}/></Col>
            <Col></Col>
            <Col></Col>
          </Row>
        </Container>
      );
    } else {
      return (
          <div className="zenerpanel">
            <br/>
            <Row>
              <Col md={12} className="align-items-center"><div><h4 className="name-text">{ this.state.name }</h4></div></Col>
            </Row>
            <Row>
              <Col md={3}>
              {drawButton}
              <br/>
               <Button variant="outline-warning" onClick={this.finish}>Finish</Button>
              </Col>
              <Col md={6}>
                <div id="resultpanel" className="resultpanel">{ this.state.results.map( (result,idx) => (
                    <Row key={idx}>
                      <Col><img src={result.card} alt="result"></img></Col>
                      <Col>
                        { !result.result ? <img src={mistake} alt="cross" className="iconsmall"></img> : <img src={tick} alt="tick" className="iconsmall"></img>  }
                      </Col>
                    </Row>
                  ))}
                </div>
              </Col>
              <Col md={3}>
                { !this.props.multiPlayer ? <img src={back} alt="back" className="card"/> : null}
              </Col>
            </Row>
            <Row>
              <Col></Col>
                {selectedCard}
              <Col className="message-box">
                <p className="message-text">{this.state.cardMessage}</p>
              </Col>
              <Col>
                { !this.state.cardDrawn ? <img src={placeholder} alt="placeholder" className="card"/> : <img src={this.state.serverCard} alt="placeholder" className="card"/> }
              </Col>
              <Col></Col>
            </Row>
            <Row>
              <Col>{!this.state.cardsDisabled ? <img id={1} alt="circle" src={circle} onClick={this.clickCard} className="card"/> : <img src={circle} alt="circle" className="card-disabled"/>}</Col>
              <Col>{!this.state.cardsDisabled ? <img id={2} alt="square" src={square} onClick={this.clickCard} className="card"/> : <img src={square} alt="square" className="card-disabled"/>}</Col>
              <Col>{!this.state.cardsDisabled ? <img id={3} alt="waves" src={waves} onClick={this.clickCard} className="card"/>  : <img src={waves} alt="waves" className="card-disabled"/>}</Col>
              <Col>{!this.state.cardsDisabled ? <img id={4} alt="cross" src={cross} onClick={this.clickCard} className="card"/> : <img src={cross} alt="cross" className="card-disabled"/>}</Col>
              <Col>{!this.state.cardsDisabled ? <img id={5} alt="star" src={star} onClick={this.clickCard} className="card"/> : <img src={star} alt="star" className="card-disabled"/>}</Col>
            </Row>
          </div>
      );
    }
  }
}

export default ZenerMain;
