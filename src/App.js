import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/* https://react.semantic-ui.com/ */
import { Button, Grid, Container } from 'semantic-ui-react'
import AWS from 'aws-sdk';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Grid columns='three' divided>
            <Grid.Row>
              <Grid.Column width={8}>
                <Button>Ok</Button>
              </Grid.Column>
              <Grid.Column width={8}>
                <Button>Ok</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default App;
