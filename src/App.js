import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

/* https://react.semantic-ui.com/ */
import { Grid, Container, Divider, Segment, Image, Header } from 'semantic-ui-react'
import AWS from 'aws-sdk';

import Build from './Build';
import Deploy from './Deploy'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container>
          <Header as='h1'>
            <Image src = 'nektar.jpg' size='small' rounded></Image> Nektar
          </Header>
          <Segment>
            <Grid columns='two' relaxed>
              <Grid.Row>
                <Grid.Column width={8}>
                  <Build></Build>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Deploy></Deploy>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Divider vertical>THEN</Divider>
          </Segment>
        </Container>
      </div>
    );
  }
}

export default App;
