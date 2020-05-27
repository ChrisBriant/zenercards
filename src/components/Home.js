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
            <Col><img src={circle} className="card-md"/></Col>
            <Col><img src={square} className="card-md"/></Col>
            <Col><img src={waves} className="card-md"/></Col>
            <Col><img src={cross} className="card-md"/></Col>
            <Col><img src={star} className="card-md"/></Col>
            </Row>
            <Button onClick={this.handlePlayComputer}>Play against computer</Button>
            <Button onClick={this.handlePlayHuman}>Play against human</Button>
            <br/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
