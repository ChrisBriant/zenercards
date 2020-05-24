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
    //this.handleRegister = this.handleRegister.bind(this);
  }

  componentDidMount(){

  }

  handleRegister() {
    this.props.history.push("/register");
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
            <br/>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Home;
