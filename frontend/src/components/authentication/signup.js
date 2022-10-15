import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Button, Input } from '@mui/material';

export default class SignUp extends Component {

  handleSignUp = async event => {
    event.preventDefault();
    console.log("SIGNUP", this.props);
    const { email, password } = this.props.inputs;
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: {
          email,
        },
        autoSignIn: {
          enabled: true,
        }
      })
      this.props.switchComponent("Verify");
    } catch (e) {
      console.error(e)
    }
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
          <Button type="button" onClick={this.handleSignUp} variant="contained">SignUp</Button>
        </form>
      </div>
    );
  }
}