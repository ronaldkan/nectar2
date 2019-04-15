import React, { Component } from 'react'
import { Button, Header, List, Form } from 'semantic-ui-react'
import { getTaskRegisterParams } from './utils/Task';
import AWS from 'aws-sdk'

class Task extends Component {

    state = { tasks: [], isLoading: false, nodeFamily: '' }

    componentDidMount() {
        setTimeout(() => {
            this.ecs = new AWS.ECS();
            this.listTaskDefinitions()
        }, 1000);
    }

    listTaskDefinitions() {
        let options = {};
        this.setState({ isLoading: true });
        this.ecs.listTaskDefinitions(options, (err, data) => {
            if (data) {
                let parsed = data.taskDefinitionArns.map(ele => {
                    return ele.split('/')[1];
                })
                this.setState({ tasks: parsed, isLoading: false });
            }
        });
    }

    registerTaskDefinition(options, e) {
        e.preventDefault();
        this.ecs.registerTaskDefinition(getTaskRegisterParams(options), (err, data) => {
            if (data) {
                this.setState({ 'nodeFamily' : ''});
                this.props.setStateValue('image', '');
                this.listTaskDefinitions();
            }
        })
    }

    fetchTaskDefinition(taskDefinition) {
        let params = {
            taskDefinition: taskDefinition
        }
        this.ecs.describeTaskDefinition(params, (err, data) => {
            if (data) {
                this.setState({
                    nodeFamily: data.taskDefinition.family
                });
                this.props.setStateValue('image', data.taskDefinition.containerDefinitions[0].image);
                this.props.setStateValue('taskdefinition', taskDefinition);
            }
        })
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    }

    handleClear = () => {
        this.props.setStateValue('image', '');
        this.setState({ 'nodeFamily': '' });
    }

    render() {
        const { tasks, isLoading, nodeFamily } = this.state;
        const { image, handleChange } = this.props;

        return (
            <div>

                <Header size='large'>Service Definition</Header>
                <Form loading={isLoading}>
                    <Form.Field>
                        <label>Service Name</label>
                        <Form.Input name='nodeFamily' value={nodeFamily} placeholder='Node family...' onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Image URI</label>
                        <Form.Input name='image' value={image} placeholder='Image path' onChange={handleChange}/>
                    </Form.Field>
                    <Button onClick={(e) => this.registerTaskDefinition({
                        image: image,
                        family: nodeFamily
                    }, e)}>Create</Button>
                    <Button style={{ 'backgroundColor': '#ef8a36', 'color': 'white' }} onClick={this.handleClear}>Clear</Button>
                </Form>
                <Header size='large'>Service List</Header>
                <List divided relaxed>
                    {
                        tasks.map((item, i) => {
                            return (
                                <List.Item key={i}>
                                    <List.Icon name='configure' size='small' verticalAlign='middle' />
                                    <List.Content>
                                        <List.Description as='a' onClick={(e) => this.fetchTaskDefinition(item, e)}>{item}
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

export default Task;