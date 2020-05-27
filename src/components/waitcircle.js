import React, { Component } from "react";

//The images below are used to create an animation
import circle1 from '../assets/circle/circle1.svg'
import circle2 from '../assets/circle/circle2.svg'
import circle3 from '../assets/circle/circle3.svg'
import circle4 from '../assets/circle/circle4.svg'
import circle5 from '../assets/circle/circle5.svg'
import circle6 from '../assets/circle/circle6.svg'
import circle7 from '../assets/circle/circle7.svg'
import circle8 from '../assets/circle/circle8.svg'
import circle9 from '../assets/circle/circle9.svg'
import circle10 from '../assets/circle/circle10.svg'
import circle11 from '../assets/circle/circle11.svg'
import circle12 from '../assets/circle/circle12.svg'
import circle13 from '../assets/circle/circle13.svg'
import circle14 from '../assets/circle/circle14.svg'
import circle15 from '../assets/circle/circle15.svg'
import circle16 from '../assets/circle/circle16.svg'
import circle17 from '../assets/circle/circle17.svg'
import circle18 from '../assets/circle/circle18.svg'

class WaitCircle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      animFrame: circle1
    }
  }

  componentDidMount(){
    var anim = [circle1,circle2,circle3,circle4,circle5,circle6,circle7,circle8,circle9,circle10,circle11,circle12,circle13,circle14,circle15,circle16,circle17,circle18];
    var frame = 0;
    var component = this;
    setInterval(function() {
      if(component.props.runAnim) {
        component.setState({animFrame:anim[frame]});
      }
      if(frame == 17) {
        frame = 0;
      } else {
        frame++;
      }
    }, component.props.speed);
  }


  render() {
    return (
      <div>
        <img className="wait-anim" src={this.state.animFrame}/>
      </div>
    );
  }
}

export default WaitCircle;
