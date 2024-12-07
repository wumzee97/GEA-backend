<div id="top"></div>

<div align="center">
  <h2 align="center">QUIZZEY Backend NodeJS API with Express, Typescript, Docker and Sequelize </h2>
</div>
<!-- 
## Documentation
[You can find the full documentation here](https://documenter.getpostman.com/view/2108248/2sA35LVfDJ) -->

## About The Project

There are a lot of section that goes into creating a production grade NodeJS application. In this repository I tried to gather as much as possible. This is an ExpressJS application with the following features.

- Typescript all the way
- EsLint, Prettier and Husky integration
- Docker
- Sequelize integration
- Multiple Environments
- Logging
- Error handling in a central place
- Request Validation
- Dependency Injection
- Setting up Testing

<p align="right">(<a href="#top">back to top</a>)</p>

## Technologies

The major technologies that were used to build this project are:

- [NodeJS](https://nodejs.org/en/)
- [Typescript](https://www.typescriptlang.org/)
- [Sequelize](https://sequelize.org/)
- [Docker](https://www.docker.com/)

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started

Here goes the instructions to get the project up and running.

### Prerequisites

To run this project You will need the following things installed on your machine

- NodeJS
- NPM
- Docker (Optional)

### Run with Docker

It's super simple. If you already have Docker installed and running on your machine you can just run

```sh
docker-compose up
```

It will give you 3 things

1. The Express server in development mode (With hot reloading support)
2. A PostgreSQL database server (If you prefer something else like MySQL just make a couple of change inside the `docker-compose.yaml` file) The credentials are

```sh
DB_HOST = database-layer;
DB_NAME = dbname;
DB_USER = dbuser;
DB_PASSWORD = dbpassword;
```

### Run without docker

If you don't use Docker then you will get an exception specifying you don't have any database.
TO avoid that you can do 2 things.

1. First go inside the `.env.development` file and specify the following variables of a database server that you are using.

```
DB_HOST=database-layer
DB_NAME=dbname
DB_USER=dbuser
DB_PASSWORD=dbpassword
```

## Project Structure

If you want to add a new route then you will goto `/routes` folder and add a new Router.
Then register that router in the `index.ts` file under the `/routes` folder.

Then you will create a Controller under the `/controllers` directory.All business logics should go into there.

Specific use cases should be handles by Service classes under the `/service` folder.

All Database related things should go under `/repositories` folder.

To create a new model for data base look into the `/models` folder.


## RabbitMQ Installation

- Run to install docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management

- Verify enabled plugin
docker exec rabbitmq rabbitmq-plugins list

- Download plugin
wget https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v3.13.0/rabbitmq_delayed_message_exchange-3.13.0.ez

- Copy downloaded plugin to rabbitMQ container 
docker cp rabbitmq_delayed_message_exchange-3.13.0.ez rabbitmq:/plugins/

- Run to enable delay message exchange
docker exec rabbitmq rabbitmq-plugins enable rabbitmq_delayed_message_exchange

- Restart RabbitMQ
docker restart rabbitmq


