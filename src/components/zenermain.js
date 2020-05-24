import React, { Component } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import circle from '../assets/circle.png';
import square from '../assets/square.svg';
import waves from '../assets/waves.svg';
import cross from '../assets/cross.svg';
import star from '../assets/star.svg';
import back from '../assets/back.svg';

class ZenerMain extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
    this.clickCard = this.clickCard.bind(this);
  }

  componentDidMount(){

  }

  clickCard(e) {
    alert("clicked");
  }

  render() {
    return (

        <div className="zenerpanel">
          <p>App goes here</p>
          <Row>
            <Col><img src={circle} onClick={this.clickCard} className="card"/></Col>
            <Col><img src={square} onClick={this.clickCard} className="card"/></Col>
            <Col><img src={waves} onClick={this.clickCard} className="card"/></Col>
            <Col><img src={cross} onClick={this.clickCard} className="card"/></Col>
            <Col><img src={star} onClick={this.clickCard} className="card"/></Col>
          </Row>
        </div>

    );
  }
}

export default ZenerMain;
