import React, { Component } from "react";
import SignIn from "./signin";
import SignUp from "./signup";
import Verify from "./verify";
import Welcome from "./welcome";
import './index.css';

import { Auth } from "aws-amplify";

export default class Authentication extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    phone_number: "",
    code: "",
    user: null, // will contain our user data object when signed in
    status: "SignIn"
  };

  componentDidMount() {
    Auth.currentAuthenticatedUser({
      bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(data => {
        let user = { username: data.username, ...data.attributes }
        if (user.email_verified) this.setState({ user, status: "Welcome" })
      })
      .catch(err => console.log(err));
  }

  // Handle changes to form inputs on sign-up, verification and sign-in
  handleFormInput = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  AuthComponent = () => {
    switch (this.state.status) {
      case "SignUp":
        return (
          <SignUp
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );

      case "Verify":
        return (
          <Verify
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );

      case "SignIn":
        return (
          <SignIn
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );

      case "Welcome":
        return <Welcome />;
      default:
        return (
          <SignUp
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );
    }
  };
  switchComponent = status => {
    this.setState({ status });
  };
  render() {
    console.log(this.state)
    return <div>{this.AuthComponent()}</div>;
  }
}