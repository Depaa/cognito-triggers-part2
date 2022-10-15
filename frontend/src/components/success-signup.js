import React, { Component } from "react";
import { Button } from '@mui/material';

export default class Success extends Component {
  render() {
    return (
      <>
        <h1>Hey we did it.</h1>
        <h2>Next step: sign in</h2>
        <Button type='button' onClick={this.props.switchComponent('SignIn')} variant='contained'>TAKE ME THERE</Button>
      </>
    );
  }
}