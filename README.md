# NestJS Microservice APP

## Stack

-   NestJS
-   Prisma
-   SQLite
-   Localstack
-   AWS
-   Kafka
-   Kafdrop
-   Docker
-   SQS

## Run

1. docker compose up
2. yarn (in all three projects)
3. yarn start (in all three projects)

## Flow

-   Sender app will keep sending messages for handler
-   Handler app will try to save it in DB
-   If it fails, message will be added do SQS Queue
-   Error Consumer app will get the messages from SQS Queue and save them for good
