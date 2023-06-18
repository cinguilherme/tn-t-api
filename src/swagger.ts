import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc'

const options = {
    // List of files to be processes. You should include the routes files
    apis: [path.resolve(__dirname, './routes/**/*.js'), path.resolve(__dirname, './routes/**/*.ts')],

    basePath: '/v1',

    // Swagger spec properties: https://swagger.io/specification/#infoObject
    swaggerDefinition: {
        openapi: '3.0.0', // use OpenAPI 3.0
        info: {
            title: 'TN REST API',
            version: '1.0.0',
            description: 'A sample API',
        },

        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}/v1`,
                description: 'Development server',
            },
        ],

        components:{
            schemas: {
                NewOperation: {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            description: 'The operation type',
                        },
                        cost: {
                            type: 'number',
                            description: 'The operation cost',
                        },
                        user: {
                            type: 'object',
                            description: 'The user who made the operation',
                        },
                    }
                },
                Operation: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'The operation id',
                        },
                        type: {
                            type: 'string',
                            description: 'The operation type',
                        },
                        cost: {
                            type: 'number',
                            description: 'The operation cost',
                        },
                        user: {
                            type: 'object',
                            description: 'The user who made the operation',
                        },
                    }
                },
                NewRecord:{
                    type: 'object',
                    properties: {
                        operationId: {},
                        input1: {},
                        input2: {},
                        user: {},
                    },
                },
                Record:{
                    type: 'object',
                    properties: {
                        id: {},
                        operationId: {},
                        input1: {},
                        input2: {},
                        user: {},
                    },
                },
                NewUser:{
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: 'The username',
                        },
                        password: {
                            type: 'string',
                            description: 'The password',
                        },
                        credits: {
                            type: 'number',
                            description: 'The user total credits credits',
                        },
                        status: {
                            type: 'string',
                            description: 'The user status',
                        },
                    }
                },
                User:{
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'The user id',
                        },
                        username: {
                            type: 'string',
                            description: 'The username',
                        },
                        // password: {
                        //     type: 'string',
                        //     description: 'The password',
                        // },
                        credits: {
                            type: 'number',
                            description: 'The user total credits credits',
                        },
                        status: {
                            type: 'string',
                            description: 'The user status',
                        },
                    }
                },
                Login:{
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: 'The username',
                        },
                        password: {
                            type: 'string',
                            description: 'The password',
                        }
                    }
                },
                LoggedInUser:{
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            description: 'A message indicating the login status',
                        },
                        token: {
                            type: 'string',
                            description: 'The string token to use in the Authorization header',
                        },
                        userId: {
                            type: 'string',
                            description: 'The user id logged in',
                        },
                    }
                },
            }
        },

    },
};

export const specs = swaggerJsdoc(options);