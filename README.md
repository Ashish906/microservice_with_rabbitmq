# Microservice with Rabbitmq

## Setup Process

    - Install Docker and Docker Compose
    - Checkout in main branch
    - Create .env file for both services and copy variables from .env.sample file
    - Goto the project directory and run `docker-compose -f ./docker-compose.yml up --build -d` command in terminal

## Application Links

    * Auth service: `http://localhost:3001`
    * Product Service: `http://localhost:3002`
    * MongoDB Url: `mongodb://localhost:27017`
    * RabbitMQ Dashboard Url: `http://localhost:15672/`

## Interservice Communication flow for Authentication

    - When someone sends request to protected route like create product, then product service emits a message(validate_token) in auth_queue.
    - Auth service consumes this message from auth_queue and validate the token send inside message body
    - If token is valid Auth service sends back payload along with full user data
    - If token is not valid it sends an RpcException to Product service
    - After getting response of validate token message, Product service will excute remaining codes and sends back a perfect response to user.

## Postman Collection

    [Link](https://www.postman.com/spaceflight-meteorologist-40408104/workspace/microservice-architecture-with-rabbitmq/collection/29638242-ea7b3b92-45bc-4f6d-9610-1a1c8d4d80b6?action=share&source=copy-link&creator=29638242)