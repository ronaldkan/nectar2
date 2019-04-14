import React, { Component } from 'react'
import { Button, Header, List, Form } from 'semantic-ui-react'

import AWS from 'aws-sdk'

class Task extends Component {

    state = {tasks: [], isLoading: false, nodeName: '', nodeFamily: '', nodeImage: this.props.nodeImage}

    componentDidMount() {
        setTimeout(() =>{
            this.ecs = new AWS.ECS();
            this.listTaskDefinitions()
        }, 1000);
    }

    listTaskDefinitions(){
        let options = {};
        this.setState({ isLoading: true});
        this.ecs.listTaskDefinitions(options, (err,data)=>{
            console.log(err);
            console.log(data);
            if (data) {
                let parsed = data.taskDefinitionArns.map(ele => {
                    return ele.split('/')[1];
                })
                this.setState({tasks: parsed, isLoading: false});
            }
        });
    }

    registerTaskDefinition(options, e){
        console.log(options);
        e.preventDefault();
        let params ={
            "executionRoleArn": "arn:aws:iam::068372893571:role/ecsTaskExecutionRole",
            "containerDefinitions": [
              {
                "dnsSearchDomains": null,
                "logConfiguration": {
                  "logDriver": "awslogs",
                  "options": {
                    "awslogs-group": `/ecs/nodetask`,
                    "awslogs-region": "ap-southeast-1",
                    "awslogs-stream-prefix": "ecs"
                  }
                },
                "portMappings": [
                  {
                    "hostPort": 8080,
                    "protocol": "tcp",
                    "containerPort": 8080
                  },
                  {
                    "hostPort": 80,
                    "protocol": "tcp",
                    "containerPort": 80
                  }
                ],
                "cpu": 0,
                "environment": [],
                "mountPoints": [],
                "memoryReservation": 128,
                "volumesFrom": [],
                "image": `${options.image}`,
                "name": `${options.name}`
              }
            ],
            "placementConstraints": [],
            "memory": "512",
            "family": `${options.family}`,
            "requiresCompatibilities": [
              "FARGATE"
            ],
            "networkMode": "awsvpc",
            "cpu": "256",
            "volumes": []
          }

          this.ecs.registerTaskDefinition(params, (err,data)=>{
              if (data){
                  this.listTaskDefinitions();
              }
          })
    }

    fetchTaskDefinition(taskDefinition){
        let params = {
            taskDefinition: taskDefinition
        }
        this.ecs.describeTaskDefinition(params, (err,data)=>{
            console.log(err)
            console.log(data)
            if (data) {
                this.setState({
                    nodeName: data.taskDefinition.containerDefinitions[0].name, 
                    nodeFamily: data.taskDefinition.family,
                    nodeImage: data.taskDefinition.containerDefinitions[0].image
                });
            }
        })
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    }

    render() {
        const { tasks, isLoading, nodeFamily, nodeName, nodeImage } = this.state;
        return (
            <div>
                <Header size='large'>Node List</Header>
                <List divided relaxed>
                    {
                        tasks.map((item, i) => {
                            return (
                                <List.Item key={i}>
                                    <List.Icon name = 'configure' size='small' verticalAlign='middle' />
                                    <List.Content>
                                        <List.Description as='a' onClick={(e) => this.fetchTaskDefinition(item, e)}>{item}
                                        </List.Description>
                                    </List.Content>
                            </List.Item>)
                        }) 
                    }
                </List>
                <Header size='large'>Node Definition</Header>
                <Form loading={isLoading}>
                    <Form.Field>
                        <label>Node Family</label>
                        <Form.Input name='nodeFamily' value={nodeFamily} placeholder='Node family...' onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Node Image</label>
                        <Form.Input name='nodeImage' value={nodeImage} placeholder='Image path' onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Node Name</label>
                        <Form.Input name='nodeName' value={nodeName} placeholder='Name' onChange={this.handleChange} />
                    </Form.Field>
                    <Button onClick={(e) => this.registerTaskDefinition({
                        image: nodeImage,
                        family: nodeFamily,
                        name: nodeName,
                    }, e)}>Submit</Button>
                </Form>
            </div>
        )
    }
}

export default Task;