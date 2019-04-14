import React, { Component } from 'react'
import { Button, Header, Form, List } from 'semantic-ui-react'
import AWS from 'aws-sdk'

class Deploy extends Component {

    state = {taskdefinition: '', runningTasks: [], ip: ''}

    componentDidMount() {
        setTimeout(() =>{
            this.ecs = new AWS.ECS();
            this.ec2 = new AWS.EC2();
            this.listTasks();
        }, 1000);
    }

    runTask(){
        let params = {
            cluster: "fargate-test",
            taskDefinition: this.state.taskdefinition,
            count: 1,
            launchType: 'FARGATE',
            networkConfiguration: {
                awsvpcConfiguration: {
                    subnets: [
                        'subnet-f47560bd'
                    ],
                    assignPublicIp: 'ENABLED',
                    securityGroups: [
                        'sg-02fb08fb50f4489bf'
                    ]
                }
            }
        }
        this.ecs.runTask(params, (err, data)=>{
            console.log(err);
            console.log(data);
        });
    }

    listTasks(){
        this.ecs.listTasks({
            cluster: "fargate-test"
        }, (err,data) => {
            this.ecs.describeTasks({
                cluster: "fargate-test",
                tasks: data.taskArns
            }, (er2, data2) =>{
                this.setState({ runningTasks: data2.tasks})
            })
        })
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.runTask();
    }

    fetchIP(item){
        console.log('fetchingIP');
        if (item.lastStatus !== 'RUNNING') return;
        this.ec2.describeNetworkInterfaces({NetworkInterfaceIds: [
            item.attachments[0].details[1].value
        ]}, (err,data)=>{
            console.log(data);
            this.setState({ip: data.NetworkInterfaces[0].Association.PublicIp});
        })
    }

    render() {
        const { taskdefinition, runningTasks, ip } = this.state;

        return (
            <div>
                <Header size='large'>Deploy</Header>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <Form.Field>
                        <label>Node Definition</label>
                        <Form.Input name='taskdefinition' value={taskdefinition} placeholder='Node Definition' onChange={this.handleChange} />
                    </Form.Field>
                    <Button type='submit'>Deploy</Button>
                </Form>
                <Header size='large'>Running Nodes</Header>
                <List divided relaxed>
                    {
                        runningTasks.map((item, i) => {
                            return (
                                <List.Item key={i}>
                                    <List.Icon name = 'sitemap' size='small' verticalAlign='middle' />
                                    <List.Content>
                                        <List.Description as='a' onClick={(e) => this.fetchIP(item, e)}>
                                            {item.taskDefinitionArn.split('/')[1]} {item.lastStatus}
                                        </List.Description>
                                    </List.Content>
                            </List.Item>)
                        }) 
                    }
                </List>
                <p size='small'>{ip}</p>
            </div>
        )
    }
}

export default Deploy;