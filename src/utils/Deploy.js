export function getRunTaskParams(taskdefinition) {
    var params = {
        cluster: "fargate-test",
        taskDefinition: taskdefinition,
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
    };

    return params;
}