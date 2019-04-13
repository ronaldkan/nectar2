export function getCodeBuildCreateParams(projectName, repository) {
    var params = {
        artifacts: { /* required */
            type: 'NO_ARTIFACTS'
        },
        environment: { /* required */
            computeType: 'BUILD_GENERAL1_SMALL', /* required */
            image: 'aws/codebuild/standard:1.0', /* required */
            type: 'LINUX_CONTAINER', /* required */
            privilegedMode: true
        },
        name: projectName, /* required */
        serviceRole: 'Codebuild-Role', /* required */
        source: { /* required */
            type: 'GITHUB', /* required */
            buildspec: `
            version: 0.2
            phases:
                pre_build:
                    commands:
                        - $(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)
                build:
                    commands:
                        -  docker build -t 068372893571.dkr.ecr.ap-southeast-1.amazonaws.com/${projectName}:latest . 
                post_build:
                    commands:
                        - docker push 068372893571.dkr.ecr.ap-southeast-1.amazonaws.com/${projectName}:latest
            artifacts:
                files:
                    - '**/*'`,
            gitCloneDepth: '1',
            gitSubmodulesConfig: {
                fetchSubmodules: true || false /* required */
            },
            insecureSsl: true || false,
            location: repository,
            reportBuildStatus: true || false,
        },
        logsConfig: {
            cloudWatchLogs: {
                status: 'DISABLED', /* required */
            },
            s3Logs: {
                status: 'DISABLED', /* required */
            }
        }
    };

    return params;
}

export function getCodeBuildProjectNameParams(projectName) {
    var params = {
        projectName: projectName,
    };

    return params;
}

export function getECRCreateParams(projectName) {
    var params ={
        repositoryName: projectName
    };

    return params;
}