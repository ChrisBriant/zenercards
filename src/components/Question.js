import React, { Component } from "react";
import decode from 'jwt-decode';
import axios from 'axios';
import AuthService from '../auth/AuthService';
import withAuth from '../auth/withAuth';

import {
  Container,
  Row,
  Col,
  Button,
  ButtonGroup,
  ButtonToolbar,
  FormControl,
  Form,
  InputGroup,
} from 'react-bootstrap';
/*
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
*/
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";

const Auth = new AuthService();

class Question extends Component {
  // Then we add our constructor which receives our props
  constructor(props) {
      super(props);
      //Determine if it is a multiple select question or sincle answer
      if(this.props.question) {
          // Next we establish our state
          this.state = {
            //qtext: this.props.question.text,
            //id: this.props.question.id,
            //answers: this.props.question.answer_set,
            //number: this.props.number,
            //checkboxtype: checkboxtype,
            selectedanswers: []
          }
          console.log("THE QUESTION");
          console.log(this.props.question);
          console.log(this.props.answers);
          // To use the 'this' keyword, we need to bind it to our function
          this.handleChoice = this.handleChoice.bind(this);
          this.getCheckbox = this.getCheckbox.bind(this);
        }
  }

  /*
  updateQuestion() {
    this.setState({
      qtext: this.props.question.text,
      id: this.props.question.id,
      answers: this.props.question.answer_set,
      number: this.props.number,
    });
  }*/


  handleChoice(e) {
    //Set the answers and then create question object to pass to parent
    //Different behaviour if radio or checkbox
    if(this.props.question.multiple) {
      var selectedanswers = this.props.answers; //this.state.selectedanswers;
      if(!selectedanswers.includes(e.target.id)) {
        selectedanswers.push(parseInt(e.target.id));
      }
    } else {
      var selectedanswers = [];
      selectedanswers[0] = parseInt(e.target.id);
    }

    var question = {qid:this.props.question.id, answers:selectedanswers};
    this.props.handleSetAnswer(question);
    //Update the answers aray
    this.setState({selectedanswers: selectedanswers});
  }

  getCheckbox(answer) {
    if(!this.props.question.multiple) {
        var checkboxtype = "radio";
    } else {
        var checkboxtype = "checkbox";
    }

    var answerarray=this.props.answers;
    console.log(answerarray);
    console.log(answer.id);
    if(answerarray.includes(answer.id)) {
      return(
        <Row>
        <Col>
        <p className="nonewline">{this.props.mapAlpha(answer.number)})&nbsp;
        <Form.Check
          className="nonewline"
          checked
          key={answer.id}
          type={checkboxtype}
          id={answer.id}
          name="answerset"
          label={answer.text}
          onChange={this.handleChoice}
        /></p>
        </Col>
        </Row>
      );
    } else {
      return(
        <Row>
        <Col>
        <p className="nonewline">{this.props.mapAlpha(answer.number)})&nbsp;
        <Form.Check
          className="nonewline"
          key={answer.id}
          type={checkboxtype}
          id={answer.id}
          name="answerset"
          label={answer.text}
          onChange={this.handleChoice}
        /></p>
        </Col>
        </Row>
      );
    }
  }


  render() {
      if(this.props.question) {
        return (
          <Container>
            <Row>
              <Col>
                <h4>QUESTION {this.props.number}</h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4>{this.props.question.text}</h4>
              </Col>
            </Row>
            <Row>
              <Form>
                <fieldset>
                  <Form.Group as={Row}>
                    <Col>
                      {this.props.question.answer_set.map( (answer) => (
                          <Col>
                          {this.getCheckbox(answer)}
                          </Col>
                        ))}
                      </Col>
                    </Form.Group>
                  </fieldset>
              </Form>
            </Row>
          </Container>
        );
      } else {
        return null;
      }
  }



}

export default withAuth(Question);
