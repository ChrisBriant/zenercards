import React, { Component } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import NumericInput from 'react-numeric-input';
//import io from 'http://localhost:8080/socket.io/socket.io.js';
import socketIOClient from "socket.io-client";

import circle from '../assets/circle.svg';
import square from '../assets/square.svg';
import waves from '../assets/waves.svg';
import cross from '../assets/cross.svg';
import star from '../assets/star.svg';
import back from '../assets/back.svg';
import tick from '../assets/check-circle-regular.svg';
import mistake from '../assets/times-circle-regular.svg';
import placeholder from '../assets/placeholder.svg';

const ENDPOINT = "http://localhost:8080/";

class ZenerMain extends Component {

  constructor(props) {
    super(props);
    console.log("props");
    console.log(this.props);
    this.state = {
      name: "",
      isStart: true,
      isFinished: false,
      numberOfCards: 1,
      drawCount: 0,
      connected: false,
      cardDrawn: false,
      guessMade: false,
      drawReady: true,
      otherPlayerFound: false,
      playerPickedCard: false,
      playerPick: false,
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
    }
  }

  componentDidMount(){
    /*
    if(!this.state.isStart) {

      var component = this;
      this.socket = socketIOClient.connect(ENDPOINT);

      this.socket.on('socketID', function() {
        this.emit('new_player',component.state.name);
        component.setState({connected:true});
      });

      this.socket.on('card_drawn', function() {
        component.setState({cardDrawn:true, serverCard:component.getCardName(0)})
      });

      this.socket.on('guess_result', function(cardNo) {
        if(parseInt(cardNo) === parseInt(component.state.selectedCardNo) )
        {
          var result = { card:component.getCardName(cardNo), result:true } ;
        } else {
          var result = { card:component.getCardName(cardNo), result:false } ;
        }
        var results = component.state.results;
        results.push(result);
        if(component.state.drawCount == component.state.numberOfCards) {
          //Exit
          component.socket.disconnect();
          component.setState({isFinished:true, serverCard:component.getCardName(parseInt(cardNo)), results:results})
        } else {
          component.setState({cardDrawn:true, drawReady:true, serverCard:component.getCardName(parseInt(cardNo)), results:results});
        }
      });
    }
    */

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
      console.log('Ready');
      console.log(component.state.drawReady);
      console.log(component.state.connected);
      if(!drawReady) {
        //Signal to the server to start the other player
        this.emit('other_player_start',otherPlayer.id);
      }
    });

    this.socket.on('card_drawn', function() {
      component.setState({cardDrawn:true, serverCard:component.getCardName(0)})
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
      if(component.state.drawCount == component.state.numberOfCards) {
        //Exit
        component.socket.disconnect();
        component.setState({isFinished:true, serverCard:component.getCardName(parseInt(cardNo)), results:results})
      } else {
        component.setState({cardDrawn:true, drawReady:true, serverCard:component.getCardName(parseInt(cardNo)), results:results});
        if(component.props.multiPlayer) {
          //Tell server the player has guessed now let other player select
          component.socket.emit('player_has_guessed',component.state.otherPlayer.id);
        }
      }
    });

    this.socket.on('draw_again', function() {
      alert("HERE");
      //Allow the player to draw another card
      component.setState({playerPickedCard:false});
    });
  }



  clickCard(e) {
    if(this.state.cardDrawn && !this.state.guessMade) {
      alert("Here");
      //Place the card in the middle and then request from the server
      this.setState({guessMade:true, cardSelection:this.getCardName(parseInt(e.target.id)), selectedCardNo:parseInt(e.target.id)});
      this.socket.emit('guess_made',e.target.id);
    } else if (this.props.multiPlayer && this.state.playerPick && !this.state.playerPickedCard) {
      //the player who is selecting gets to pick a card
      this.setState({playerPickedCard:true, cardSelection:this.getCardName(parseInt(e.target.id)), selectedCardNo:parseInt(e.target.id)});
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
    this.socket.disconnect();
    this.setState({isFinished:true});
  }

  goToHome() {
    this.props.history.push('/')
  }


  render() {
    if(!this.props.multiPlayer) {
      var selectedCard = <Col>{ !this.state.guessMade ? <img src={placeholder} className="card"/> : <img src={this.state.cardSelection} className="card"/> }</Col>;
    } else {
      console.log("MultiPlayer");
      console.log(this.state.playerPickedCard);
      console.log(this.state.guessMade);
      /*
      if(!this.state.guessMade && !this.state.playerPickedCard){
        var selectedCard = <Col><img src={placeholder} className="card"/></Col>;
      } else {
        console.log("I am a cat");
        var selectedCard = <Col><img src={this.state.cardSelection} className="card"/></Col>;
      }*/
      var selectedCard = <Col>{ !this.state.guessMade && !this.state.playerPickedCard ? <img src={placeholder} className="card"/> : <img src={this.state.cardSelection} className="card"/> }</Col>;
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
          </Row>
          <Row>
            <Col>
              <label>Select number of guesses</label>
            </Col>
            <Col>
              <NumericInput min={1} max={100} value={this.state.numberOfCards} className="form-control" onChange={this.handleChangeCardCount}/>
            </Col>
          </Row>
          <Row>
            <Col><Button onClick={this.handleStart}>START</Button></Col>
          </Row>
        </Container>
      );
    } else if(this.state.isFinished) {
      return (
        <Container>
          <Row>
            <Col>Results:</Col>
          </Row>
          <Row>
            <Col>{this.state.results.filter(r => r.result).length}  /  { this.state.results.length } </Col>
          </Row>
          <Row>
            <Col>
              <div className="resultpanel">{ this.state.results.map( (result,idx) => (
                  <Row key={idx}>
                    <Col><img src={result.card}></img></Col>
                    <Col>
                      { !result.result ? <img src={mistake} className="iconsmall"></img> : <img src={tick} className="iconsmall"></img>  }
                    </Col>
                  </Row>
                ))}
              </div>
            </Col>
          </Row>
          <Row>
            <Col><Button onClick={this.goToHome}>Exit</Button></Col>
          </Row>
        </Container>
      );
    } else if(this.props.multiPlayer && !this.state.otherPlayerFound) {
      return (
        <Container>
          <Row>
            <Col>Waiting for other player</Col>
          </Row>
        </Container>
      );
    } else {
      return (
          <div className="zenerpanel">
            <p>App goes here</p>
            <Row>
              <Col>
                {this.state.connected && this.state.drawReady && !this.props.multiPlayer ? <Button onClick={this.drawCard}>{this.state.name} Draw Card</Button> : <Button disabled>{this.state.name} Draw Card</Button> }
              </Col>
              <Col>
               <Button onClick={this.finish}>Finish</Button>
              </Col>
              <Col>
                <div className="resultpanel">{ this.state.results.map( (result,idx) => (
                    <Row key={idx}>
                      <Col><img src={result.card}></img></Col>
                      <Col>
                        { !result.result ? <img src={mistake}></img> : <img src={tick}></img>  }
                      </Col>
                    </Row>
                  ))}
                </div>
              </Col>
              <Col></Col>
              <Col>
                { !this.state.multiPlayer ? <img src={back} onClick={this.clickCard} className="card"/> : null}
              </Col>
            </Row>
            <Row>
              <Col></Col>
                {selectedCard}
              <Col>
                { this.props.multiPlayer && this.state.playerPick ? <p>{ this.state.name } pick a card</p> : null }
                { this.props.multiPlayer && !this.state.playerPick && this.state.cardDrawn ? <p>{ this.state.name } pick a card</p> : null }
              </Col>
              <Col>
                { !this.state.cardDrawn ? <img src={placeholder} className="card"/> : <img src={this.state.serverCard} className="card"/> }
              </Col>
              <Col></Col>
            </Row>
            <Row>
              <Col><img id={1} src={circle} onClick={this.clickCard} className="card"/></Col>
              <Col><img id={2} src={square} onClick={this.clickCard} className="card"/></Col>
              <Col><img id={3} src={waves} onClick={this.clickCard} className="card"/></Col>
              <Col><img id={4} src={cross} onClick={this.clickCard} className="card"/></Col>
              <Col><img id={5} src={star} onClick={this.clickCard} className="card"/></Col>
            </Row>
          </div>
      );
    }
  }
}

export default ZenerMain;
