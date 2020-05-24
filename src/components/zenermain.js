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
    this.state = {
      isStart: true,
      numberOfCards: 1,
      connected: false,
      cardDrawn: false,
      guessMade: false,
      drawReady: true,
      results: []
    }
    this.clickCard = this.clickCard.bind(this);
    this.drawCard = this.drawCard.bind(this);
    this.handleChangeCardCount = this.handleChangeCardCount.bind(this);
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
    if(!this.state.isStart) {
      var component = this;
      this.socket = socketIOClient.connect(ENDPOINT);

      this.socket.on('socketID', function() {
        this.emit('new_player','ME');
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
        component.setState({cardDrawn:true, drawReady:true, serverCard:component.getCardName(parseInt(cardNo)), results:results});
      });
    }

  }



  clickCard(e) {
    if(this.state.cardDrawn && !this.state.guessMade) {
      //Place the card in the middle and then request from the server
      this.setState({guessMade:true, cardSelection:this.getCardName(parseInt(e.target.id)), selectedCardNo:parseInt(e.target.id)});
      this.socket.emit('guess_made',e.target.id);
    }
  }

  drawCard(e) {
    e.preventDefault();
    this.setState({drawReady:false, guessMade:false});
    this.socket.emit('draw_card',this.socket.id);
  }

  handleChangeCardCount(e) {
    console.log(e);
    this.setState({numberOfCards:e});
  }



  render() {
    if(this.state.isStart) {
      return (
        <Container>
        <Row>
          <Col>
            <label>Select number of guesses</label>
            <NumericInput min={1} max={100} value={this.state.numberOfCards} className="form-control" onChange={this.handleChangeCardCount}/>
          </Col>
        </Row>
        <Row>
          <Col><Button onClick={this.handleStart}>START</Button></Col>
        </Row>
        </Container>
      );
    } else {
      return (
          <div className="zenerpanel">
            <p>App goes here</p>
            <Row>
              <Col>
                {this.state.connected && this.state.drawReady ? <Button onClick={this.drawCard}>Draw Card</Button> : <Button disabled>Draw Card</Button> }
              </Col>
              <Col></Col>
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
              <Col><img src={back} onClick={this.clickCard} className="card"/></Col>
            </Row>
            <Row>
              <Col></Col>
              <Col>
                { !this.state.guessMade ? <img src={placeholder} className="card"/> : <img src={this.state.cardSelection} className="card"/> }
              </Col>
              <Col></Col>
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
