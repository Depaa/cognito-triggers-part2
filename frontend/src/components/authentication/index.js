import React, { Component, useState } from 'react';
import { Auth } from 'aws-amplify';

import SignIn from './signin';
import SignUp from './signup';
import Verify from './verify';
import Welcome from './welcome';
import Camera from './camera';
import Success from './success-signup';
import './index.css';


export default class Authentication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: 'pswBLOG2022?',
      sub: '',
      code: '',
      user: null,
      status: 'SignUp',
      file: null,
      fileUrl: null,
    };
  }

  async componentDidMount() {
    const auth = await Auth.currentAuthenticatedUser({
      bypassCache: false
    })
    const user = { username: auth.username, ...auth.attributes }
    if (user.email_verified) this.setState({ user, status: 'Welcome' })
  }

  handleFormInput = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  switchComponent = status => {
    this.setState({ status });
  };

  AuthComponent = () => {
    switch (this.state.status) {
      case 'SignUp':
        return (
          <SignUp
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );

      case 'Verify':
        return (
          <Verify
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );

      case 'Camera':
        return (
          <Camera
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );

      case 'Success':
        return (
          <Success
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );

      case 'SignIn':
        return (
          <SignIn
            switchComponent={this.switchComponent}
            handleFormInput={this.handleFormInput}
            inputs={this.state}
          />
        );

      case 'Welcome':
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

  render() {
    return <div>{this.AuthComponent()}</div>;
  }
}