import React, { Component } from "react";
import { Auth, Hub } from "aws-amplify";
import { Button, Input } from '@mui/material';

export default class Verify extends Component {

  handleVerification = async event => {
    event.preventDefault();
    const { email, code } = this.props.inputs;
    const auth = await Auth.confirmSignUp(email, code, {
      forceAliasCreation: true
    });

    Hub.listen('auth', ({ payload }) => {
      const { event } = payload;
      if (event === 'autoSignIn') {
        const user = payload.data;
        console.log("AUTH_LISTEN", user);
        this.setState({ sub: user.username })
      }
    })

    console.log("Verify", auth);
    this.props.switchComponent("Camera");
  };

  render() {
    return (
      <div className="verify">
        <form className="form">
          <Input
            type="text"
            name="code"
            value={this.props.code}
            placeholder="Verification Code"
            onChange={this.props.handleFormInput}
          />
          <Button type="button" onClick={this.handleVerification} variant="contained">CONFIRM</Button>
        </form>
      </div>
    );
  }
}