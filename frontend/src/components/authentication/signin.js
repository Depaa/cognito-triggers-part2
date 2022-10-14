import React, { Component } from "react";
import { Auth } from "aws-amplify";
import {
  Button,
  Input
} from '@mui/material'


export default class SignIn extends Component {
  handleSignIn = async event => {
    event.preventDefault();
    const { username } = this.props.inputs;
    const password = 'Password1!'
    
    const cognitoUser = await Auth.signIn({ username/*, password*/ })

    // TODO scattare foto, inviare answer
    const answer = "";
    await Auth.sendCustomChallengeAnswer(cognitoUser, answer);
    
    const auth = await Auth.currentSession();
    console.log(auth)
  };

  render() {
    return (
      <div className="login">
        <form className="form">
          <Input
            type="text"
            name="username"
            value={this.props.username}
            placeholder="Email"
            onChange={this.props.handleFormInput}
            variant="filled"
          />
          <Button type="button" onClick={this.handleSignIn} variant="contained">Submit</Button>
        </form>
      </div>
    );
  }
}