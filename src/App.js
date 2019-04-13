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
    // Create unique bucket name
    var bucketName = 'sdk-test1';
    // Create name for uploaded object key
    var keyName = 'hello_world.txt';

    // Create a promise on S3 service object
    var bucketPromise = new AWS.S3({ apiVersion: '2006-03-01' }).createBucket({ Bucket: bucketName }).promise();

    // Handle promise fulfilled/rejected states
    bucketPromise.then(
      function (data) {
        // Create params for putObject call
        var objectParams = { Bucket: bucketName, Key: keyName, Body: 'Hello World!' };
        // Create object upload promise
        var uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
        uploadPromise.then(
          function (data) {
            console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
          });
      }).catch(
        function (err) {
          console.error(err, err.stack);
        });
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
