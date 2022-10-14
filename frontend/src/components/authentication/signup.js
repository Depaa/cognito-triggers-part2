import React, { Component } from "react";
import { Auth } from "aws-amplify";
import {
  Button,
  Input
} from '@mui/material'
const uuid = require('uuid');

export default class SignUp extends Component {

  handleSignUp = async event => {
    event.preventDefault();
    const fileLocation = "signup/" + uuid.v5();
    const { email } = this.props.inputs;
    const password = 'Password1!';
    const auth = await Auth.signUp({
      username: email,
      password,
      attributes: {
        email,
        'custom:flag': fileLocation,
      },
    })
    console.log(auth);
  };

  render() {
    return (
      <div className="signup">
        <form className="form">
          <Input
            type="email"
            name="email"
            value={this.props.email}
            placeholder="Email"
            onChange={this.props.handleFormInput}
            variant="filled"
          />
          <Button type="button" onClick={this.handleSignUp} variant="contained">Submit</Button>
        </form>
      </div>
    );
  }
}