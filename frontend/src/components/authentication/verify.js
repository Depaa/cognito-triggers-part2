import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Button, Input } from '@mui/material';

export default class Verify extends Component {

  handleVerification = async event => {
    event.preventDefault();
    const { email, code } = this.props.inputs;
    try {
      await Auth.confirmSignUp(email, code, {
        forceAliasCreation: true
      });

      this.props.switchComponent("Camera");
    } catch (e) {
      console.error(e)
    }
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