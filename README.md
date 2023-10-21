# Trip Tribe Backend

## Technologies Used

The backend is built with the following technologies:

- [Nest](https://github.com/nestjs/nest)
- [MongoDB]
- [Mongoose]

- [Restful]
- [GraphQL]
- [TypeScript]

## Getting Started

1. Clone the repository to your local machine.
2. Install the project dependencies by running `npm install`.

## Setup the Database locally

1. Install Docker (https://www.docker.com/get-started/).
2. Create a Docker container using the MongoDB image by running the following command.

```bash
$ docker run --name triptribe-mongodb -d -p 27017:27017 -v mongodb_data:/data/db mongo

```

## Running the app

Ensure the triptribe-mongodb container is running in Docker Desktop,
or run `docker start triptribe-mongodb` to start the container.

Remember to stop the container after exiting the app.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test API

After starting the app, use postman to test the API

The local development environment of backend is localhost:8080/api

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
