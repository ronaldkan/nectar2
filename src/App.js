import React, { Component } from 'react';
import './App.css';

/* https://react.semantic-ui.com/ */
import { Grid, Container, Segment, Image, Header } from 'semantic-ui-react'
import AWS from 'aws-sdk'

import Build from './Build';
import Deploy from './Deploy';
import Task from './Task';

class App extends Component {
  state = { image: '' };

  componentDidMount(){
    // initialize AWS credential and limit api versions
    var creds = new AWS.Credentials('', '');
    AWS.config.credentials = creds;
    AWS.config.region = 'ap-southeast-1';
    AWS.config.apiVersions = {
        codebuild: '2016-10-06',
        ecr: '2015-09-21',
        ecs: '2014-11-13'
    };
  }

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
            <Grid columns='three' relaxed>
              <Grid.Row>
                <Grid.Column width={6}>
                  <Build setImageValue={this.setImageValue}/>
                </Grid.Column>
                <Grid.Column width={6}>
                  <Task nodeImage={image}/>
                </Grid.Column>
                <Grid.Column width={4}>
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
