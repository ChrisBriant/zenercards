import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./components/Home.js";
import ZenerMain from "./components/zenermain.js";
import './index.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import logo from './assets/zenerlogo.svg';

class Main extends Component {
  state = ({loggedin:false, loginmessage: "Login"});


  componentDidMount = () => {
  }


  setRunning = (running) => {
    //alert(running);
    this.setState({runningtest:running});
    //alert(this.state.runningtest);
  }

  setLogInMessage = (message) => {
    this.setState({loginmessage:message});
  }

  refreshComments = () => {
    this.setState({refreshcomments:true});
  }


  render() {
      return (
        <HashRouter>
          <Container className="pagecontainer">
            <Row>
              <Col>
                <br/>
                <Row>
                  <Col md={2}><img src={logo} alt="logo" /></Col>
                  <Col><h1 className="titletext">Zener ESP Test</h1></Col>
                  <Col md={2}></Col>
                </Row>
                <br/><br/>
                <Row>
                  <Col>
                    <Route exact path="/" render={props => (<Home {...props} setTest={this.setTest}/>)}/>
                    <Route exact path="/playcomputer" render={props => (<ZenerMain {...props} multiPlayer={false}/>)}/>
                    <Route exact path="/playhuman" render={props => (<ZenerMain {...props}  multiPlayer={true}/>)}/>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <br/>
              <Col><p className="citation">Icons by <a href="https://fontaweson.com">Font Awesome</a></p></Col>
            </Row>
            <br/>
          </Container>
        </HashRouter>
      );
    }
}

export default Main;
