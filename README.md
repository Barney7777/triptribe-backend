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

## Setup the Database and Redis locally with Docker Desktop

1. Install Docker (https://www.docker.com/get-started/).
2. Create a Docker container using the MongoDB image and Redis image by running the following command at the root path of this project.
```bash
$ npm run docker:up 
```

## Running the app

Ensure the triptribe-backend container is running in Docker Desktop,
or run `docker compose start` to start the container.

Remember to stop the container after exiting the app.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# generate fake data for testing or staging
$ npm run db:seed
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

````

## Test API

After starting the app, use postman to test
The local development environment url is localhost:8080

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
````

## Test the file API (Before your test, please make sure you have the AWS Access Key pare. If not, please contact DevOps)

1. Place your AWS Access Key pare into the .env.development

2. Use the current URL:

http://localhost:8080/api/photo/upload

3. Switch the request method to POST

4. Select Body parameter

5. Select form-data mathod

6. Set the key as files and switch 'text' to 'file' in the field

7. Select photos to upload. (The maxium number of uploads is 10 and must not exceed 10 MB, and must be jpeg, png, or gif.)

# API DOCUMENT

Use the URL: http://localhost:8080/api

# AdminJS management panel

Follow guidance in '/adminjs/README.md' to setup and start AdminJS app.

After starting the app, use the URL: http://localhost:3000/admin to access panel.

Default login detail:
email: 'admin@triptribe.com',
password: 'password',

