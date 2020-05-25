import React, { Component } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

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
            <h4>Welcome</h4>
            <br/>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Home page goes here</p>
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
