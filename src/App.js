import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/* https://react.semantic-ui.com/ */
import { Button, Grid, Container } from 'semantic-ui-react'
import AWS from 'aws-sdk';
import uuid from 'uuid';


import Build from './Build';
import Deploy from './Deploy'

class App extends Component {

  componentDidMount() {
    var creds = new AWS.Credentials('AKIAQ722XR6B2NNPH3WZ', 'ardJbvvUuIp/kd1gZtekI/4FOGzPldxykpMdMUNa');
    AWS.config.credentials = creds;
  }

  render() {
    return (
      <div className="App">
        <Container>
          <Grid columns='three' divided>
            <Grid.Row>
              <Grid.Column width={8}>
                <Build></Build>
              </Grid.Column>
              <Grid.Column width={8}>
                <Deploy></Deploy>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );  
  }
}

export default App;
