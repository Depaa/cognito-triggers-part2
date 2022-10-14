import './components/camera/index.css';
import Camera from "./components/camera";
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import React, { Component } from 'react';
import Authentication from "./components/authentication"
Amplify.configure(config);

class App extends Component {
  render() {
    return (
      <>
        <div className="Camera">
          <Camera />
        </div>
        <div>
          <Authentication />
        </div>
      </>
    );
  }
}

export default App;
