import React, { Component } from 'react';
import './App.css';

/* https://react.semantic-ui.com/ */
import { Grid, Container, Segment, Image, Header } from 'semantic-ui-react'

import Build from './Build';
import Deploy from './Deploy'

class App extends Component {
  state = { image: '' };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  setImageValue = (imageName) => {
    this.setState({ image: imageName });
  }


  render() {
    const { image } = this.state;

    return (
      <div className="App">
        <Container>
          <Header as='h1'>
            <Image src='nektar.jpg' size='small' rounded></Image> Nektar
          </Header>
          <Segment>
            <Grid columns='two' relaxed>
              <Grid.Row>
                <Grid.Column width={10}>
                  <Build setImageValue={this.setImageValue}/>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Deploy image={image} handleChange={this.handleChange} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Container>
      </div>
    );
  }
}

export default App;
