import React, { Component } from 'react'
import { Button, Header, Form, List } from 'semantic-ui-react'
import AWS from 'aws-sdk'
import { getRunTaskParams } from './utils/Deploy';

class Deploy extends Component {

    state = { runningTasks: [], ip: '', isLoading: false }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.ecs = new AWS.ECS();
            this.ec2 = new AWS.EC2();
            this.listTasks();
        }, 15000);
    }

    componentWillUnmount() {
        // turn off background task when leaving the page
        this.timer = null;
    }

    listTasks() {
        this.ecs.listTasks({
            cluster: "fargate-test"
        }, (err, data) => {
            this.ecs.describeTasks({
                cluster: "fargate-test",
                tasks: data.taskArns
            }, (er2, data2) => {
                if (data2) {
                    this.setState({ runningTasks: data2.tasks });
                }
            })
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ isLoading: true });
        this.ecs.runTask(getRunTaskParams(this.props.taskdefinition), (err, data) => { 
            this.setState({ isLoading: false });
        });
    }

    fetchIP(item) {
        if (item.lastStatus !== 'RUNNING') return;
        this.ec2.describeNetworkInterfaces({
            NetworkInterfaceIds: [
                item.attachments[0].details[1].value
            ]
        }, (err, data) => {
            window.open(`http://${data.NetworkInterfaces[0].Association.PublicIp}:8080`);
        })
    }

    render() {
        const { runningTasks, isLoading } = this.state;
        const { taskdefinition, handleChange } = this.props;

        return (
            <div>
                <Header size='large'>Deploy</Header>
                <Form loading={isLoading} onSubmit={(e) => this.handleSubmit(e)}>
                    <Form.Field>
                        <label>Node Definition</label>
                        <Form.Input name='taskdefinition' value={taskdefinition} placeholder='Node Definition' onChange={handleChange} />
                    </Form.Field>
                    <Button type='submit'>Deploy</Button>
                </Form>
                <Header size='large'>Running Services</Header>
                <List divided relaxed>
                    {
                        runningTasks.map((item, i) => {
                            return (
                                <List.Item key={i}>
                                    <List.Icon name='sitemap' size='small' verticalAlign='middle' />
                                    <List.Content onClick={(e) => this.fetchIP(item, e)}>
                                        <List.Header as='a'>{item.taskDefinitionArn.split('/')[1]}</List.Header>
                                        <List.Description as='a'>
                                            {item.lastStatus}
                                        </List.Description>
                                    </List.Content>
                                </List.Item>)
                        })
                    }
                </List>
            </div>
        )
    }
}

export default Deploy;