# TypeScript, Node.js & Express RESTful API

This repository contains a backend RESTful API built using TypeScript, Node.js, and Express. The API provides resources that the frontend application will use, including User, Operation, and Records.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [API Documentation](#api-documentation)

## Technology Stack

- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript
- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 JavaScript engine
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [DynamoDb]

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed on your local development machine:

- [Node.js](https://nodejs.org/) v12.x.x or higher
- [NPM](https://www.npmjs.com/) v6.x.x or higher (comes with Node.js)
- [Docker]
- [Docker-Compose]

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/typescript-node-express-api.git
   ```

2. Navigate to the project directory:

3. Install project dependencies:

   ```
   npm install
   ```

4. Start the development server:

   ```
   npm start
   ```

The API should now be running on [http://localhost:3000](http://localhost:3000).

## Docs
- `GET /v1/docs` - Swagger UI Documentation

## API Documentation

### User

- `POST /users` - Create a new user
- `GET /users/:id` - Get a user by ID
- `PUT /users/:id` - Update a user by ID
- `DELETE /users/:id` - Delete a user by ID

### Operation

- `POST /operations` - Create a new operation
- `GET /operations` - Get a list of all available operations (addition, subtraction, multiplication, division)
- `GET /operations/:id` - Get an operation by ID

### Records

- `POST /records` - Create a new record
- `GET /records/:userId` - Get all records for a user
- `GET /records/:userId/:id` - Get a specific record for a user
- `DELETE /records/:userId/:id` - Delete a specific record for a user

Live Demo: [RootAPI](https://q9wzzzzdhk.execute-api.us-east-1.amazonaws.com/default/%7Bproxy+%7D)
