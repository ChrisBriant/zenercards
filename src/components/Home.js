import React, { Component } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import WaitCircle from './waitcircle.js';
import circle from '../assets/circle.svg';
import square from '../assets/square.svg';
import waves from '../assets/waves.svg';
import cross from '../assets/cross.svg';
import star from '../assets/star.svg';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.handlePlayComputer = this.handlePlayComputer.bind(this);
    this.handlePlayHuman = this.handlePlayHuman.bind(this);
  }

  componentDidMount(){

  }

  handleRegister() {
    this.props.history.push("/register");
  }

  handlePlayComputer() {
    this.props.history.push("/playcomputer");
  }

  handlePlayHuman() {
    this.props.history.push("/playhuman");
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h4>Do you have ESP?</h4>
            <br/>
          </Col>
        </Row>
        <Row>
          <Col>
            <p><strong>&quot;Extrasensory perception</strong> or <strong>ESP</strong>, also called <strong>sixth sense</strong>,
            includes claimed reception of information not gained through the recognized physical senses, but sensed with the mind.&quot;</p>
            <p>-Definition from <a href="https://en.wikipedia.org/wiki/Extrasensory_perception">Wikipedia</a></p>
            <p>This app is designed as a psychological experiment to test the existance of ESP using Zener cards.
            Zener cards have five symbols, shown below.</p>
            <Row>
            <Col md={3}></Col>
            <Col><img src={circle} className="card-md"/></Col>
            <Col><img src={square} className="card-md"/></Col>
            <Col><img src={waves} className="card-md"/></Col>
            <Col><img src={cross} className="card-md"/></Col>
            <Col><img src={star} className="card-md"/></Col>
            <Col md={3}></Col>
            </Row>
            <p>To take part, you can either play against a compter or a human.</p>
            <Row>
              <Col md={4}></Col>
              <Col><Button onClick={this.handlePlayComputer}>Play against computer</Button></Col>
              <Col><Button onClick={this.handlePlayHuman}>Play against human</Button></Col>
              <Col md={4}></Col>
            </Row>
            <h4>Against the Computer</h4>
            <p>A card will be pre selected from the server. Try to picture that card and when the image comes into your head make a
            selection. The server will then tell you if that is correct.</p>
            <h4>Against Human</h4>
            <p>A human player is selected. Each person in turn selects cards, one person chooses a card and transmits the image while
             the other chooses a card. The turns swap over once the player has played as the transmitter / receiver.</p>
             <p>When selecting cards, try to project the image from the card to the other person and when receiving an image from a person
             try to picture that image being received.</p>
             <h4>The Results</h4>
             <p>This is based on a set of 25 cards.</p>
             <strong>28% or below</strong>
             <p>This is within normal levels and doesn't indicate ESP</p>
             <strong>Between 28% and 60%</strong>
             <p>Scores will often fall within this range, it could indicate possible ESP</p>
             <strong>Between 60% and 80%</strong>
             <p>The probability of getting a score within this range is about 1 in 90,000.
             this means you are either incredibly lucky or psychic!</p>
             <strong>80% and Above</strong>
             <p>The chances are about one in five billion, you almost certainly have ESP.</p>
             <p>-Taken from the Wikipedia article</p>
            <br/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
