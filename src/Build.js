import React, { Component } from 'react'
import { Button, Header, Form, List, Divider, Popup } from 'semantic-ui-react'
import moment from 'moment';
import AWS from 'aws-sdk';
import { getCodeBuildCreateParams, getCodeBuildProjectNameParams, getECRCreateParams } from './utils/Build';

class Build extends Component {

    state = { projectName: '', repository: '', isLoading: false, isError: false, builds: [], isBuilds: true };

    componentDidMount() {
        // initialize AWS credential and limit api versions
        var creds = new AWS.Credentials('', '');
        AWS.config.credentials = creds;
        AWS.config.region = 'ap-southeast-1';
        AWS.config.apiVersions = {
            codebuild: '2016-10-06',
            ecr: '2015-09-21'
        };

        // background task to fetch builds
        this.fetchBuilds();
        this.timer = setInterval(() => this.fetchBuilds(), 15000);
    }

    fetchBuilds() {
        var codebuild = new AWS.CodeBuild();
        var ecr = new AWS.ECR();
        var projectName = this.state.projectName;
        if (!projectName) {
            return;
        }
        if (this.state.isBuilds) {
            codebuild.listBuildsForProject(getCodeBuildProjectNameParams(projectName), (err, data) => {
                if (data) {
                    codebuild.batchGetBuilds(data, (err, data) => {
                        this.setState({ builds: data.builds })
                    })
                }
            });
        } else {
            ecr.listImages(getECRCreateParams(projectName), (err, data) => {
                if (data) {
                    var params = {
                        imageIds: data.imageIds,
                        repositoryName: projectName
                    }
                    ecr.batchGetImage(params, (err, data) => {
                        this.setState({ builds: data.images })
                        console.log(err);
                        console.log(data);
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        // turn off background task when leaving the page
        this.timer = null;
    }

    performBuild = (codebuild, projectName) => {
        codebuild.startBuild(getCodeBuildProjectNameParams(projectName), function (err, data) {
            if (err) {
                console.log(`Error at Codebuild build stage: ${err}`);
            }
        });
    }

    handleIsBuildsToggle = (trueFalse) => {
        this.setState({ builds: [], isBuilds: trueFalse });
    }

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    }

    handleSubmit = (performBuild) => {
        const { projectName, repository } = this.state;
        if (!repository | repository.indexOf("/") === -1) {
            this.setState({ isError: true });
            return
        }
        // initialize AWS Service Classes
        var ecr = new AWS.ECR();
        var codebuild = new AWS.CodeBuild();
        this.setState({ isLoading: true, isBuilds: true });
        ecr.createRepository(getECRCreateParams(projectName), (err, data) => {
            if (err) {
                // project already exists, retrigger build
                console.log(`Error at ECR creation stage: ${err}`);
                performBuild(codebuild, projectName);
                this.setState({ isLoading: false });
            }
            else {
                codebuild.createProject(getCodeBuildCreateParams(projectName, repository), (err, data) => {
                    if (err) {
                        console.log(`Error at Codebuild project creation stage: ${err}`);
                    }
                    else {
                        performBuild(codebuild, projectName);
                        this.setState({ isLoading: false });
                    }
                });
            }
        });
    }

    render() {
        const { projectName, repository, isLoading, isError, builds, isBuilds } = this.state;
        const { setImageValue } = this.props;

        return (
            <div>
                <Header size='large'>Build</Header>
                <Form loading={isLoading} onSubmit={() => this.handleSubmit(this.performBuild)}>
                    <Form.Field>
                        <label>Project Name(Service Name)</label>
                        <Form.Input error={isError} name='projectName' value={projectName} placeholder='Project Name...' onChange={this.handleChange} />
                    </Form.Field>
                    <Form.Field>
                        <label>Repository</label>
                        <Form.Input error={isError} name='repository' value={repository} placeholder='Git repository Url...' onChange={this.handleChange} />
                    </Form.Field>
                    <Button type='submit'>Build</Button>
                </Form>
                <Divider horizontal>|</Divider>
                <Button.Group>
                    <Button positive={isBuilds} onClick={() => this.handleIsBuildsToggle(true)}>Builds</Button>
                    <Button.Or />
                    <Button positive={!isBuilds} onClick={() => this.handleIsBuildsToggle(false)}>Images</Button>
                </Button.Group>
                <List divided relaxed>
                    {
                        isBuilds ?
                            builds.map(function (item, i) {
                                return (

                                    <List.Item key={i}>
                                        <Popup trigger={<List.Icon name={item.buildStatus === 'SUCCEEDED' ? 'check' : 'sync'} 
                                                size='large' verticalAlign='middle' />} 
                                                content={item.buildStatus === 'SUCCEEDED' ? 'Build Complete' : 'Build in progress'}>
                                        </Popup>
                                        <List.Content>
                                            <List.Header as='a'>{item.id}.</List.Header>
                                            <List.Description as='a'>{moment(item.startTime).fromNow()}</List.Description>
                                        </List.Content>
                                    </List.Item>)


                            }) :
                            builds.map(function (item, i) {
                                return (

                                    <List.Item key={i}>
                                        <List.Icon name='box' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header as='a' onClick={() =>
                                                setImageValue(`${item.registryId}.dkr.ecr.ap-southeast-1..amazonaws.com/${item.repositoryName}@${item.imageId.imageDigest}`)}>
                                                {item.registryId}.dkr.ecr.ap-southeast-1..amazonaws.com/{item.repositoryName}@{item.imageId.imageDigest}
                                            </List.Header>
                                            <List.Description as='a'>{item.imageId.imageTag ? item.imageId.imageTag : '<untagged>'}</List.Description>
                                        </List.Content>
                                    </List.Item>)


                            })
                    }
                </List>
            </div>
        )
    }
}

export default Build;