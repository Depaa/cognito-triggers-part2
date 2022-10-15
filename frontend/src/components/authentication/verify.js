import React, { Component } from "react";
import { Auth, Hub } from "aws-amplify";
import { Button, Input } from '@mui/material';

export default class Verify extends Component {

  handleVerification = async event => {
    event.preventDefault();
    console.log("VERIFY", this.props);
    const { email, code } = this.props.inputs;
    try {
      const auth = await Auth.confirmSignUp(email, code, {
        forceAliasCreation: true
      });
      console.log("AUTH", auth);

      // Hub.listen('auth', ({ payload }) => {
      //   const { event } = payload;
      //   if (event === 'autoSignIn') {
      //     const user = payload.data;
      //     console.log("AUTH_LISTEN", user);
      //     // this.setState({ sub: user.username })
      //     console.log("VERIFY_HUB", this.props);
      //   }
      // })

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