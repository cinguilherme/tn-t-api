const awsServerlessExpress = require('aws-serverless-express');
const app = require('./dist/index.js'); // Change './app' to the path of your Express app file

const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
