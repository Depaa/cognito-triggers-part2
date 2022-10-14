import React, { Component } from "react";
import { Auth } from "aws-amplify";

export default class Verify extends Component {
  handleVerification = event => {
    event.preventDefault();
    const { username, code } = this.props.inputs;
    // After retrieveing the confirmation code from the user
    Auth.confirmSignUp(username, code, {
      forceAliasCreation: true
    })
      .then(data => console.log(data))
      .then(() => this.props.switchComponent("SignIn"))
      .catch(err => console.log(err));
  };

  render() {
    return (
      <form className="authentication__form">
        <input
          type="text"
          name="code"
          value={this.props.code}
          placeholder="Verification Code"
          onChange={this.props.handleFormInput}
          className="authentication__input"
        />
        <input
          type="submit"
          value="SUBMIT VERIFICATION"
          onClick={this.handleVerification}
          className="authentication__button"
        />
      </form>
    );
  }
}