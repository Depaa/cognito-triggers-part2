import { Amplify } from 'aws-amplify';
import config from './aws-exports';
import React, { Component } from 'react';
import Authentication from "./components"
Amplify.configure(config);

class App extends Component {
  render() {
    return (
      <>
        <div>
          <Authentication />
        </div>
      </>
    );
  }
}

export default App;
