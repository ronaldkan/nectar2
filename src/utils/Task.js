export function getTaskRegisterParams(options) {
    var params = {
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
                "name": `${options.family}-container`
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

    return params;
}