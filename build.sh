#!/bin/bash
docker build \
--build-arg NODE_ENV='production' \
--build-arg PORT='8080' \
--build-arg DATABASE_URI=$DATABASE_URI \
--build-arg S3_BUCKET_NAME=$S3_BUCKET_NAME \
--build-arg AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
--build-arg AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
--build-arg AWS_REGION=$AWS_REGION \
--build-arg JWT_SECRET=$JWT_SECRET \
--build-arg MAX_FILE_SIZE=$MAX_FILE_SIZE \
--build-arg MAX_FILES=$MAX_FILES \
--build-arg SENTRY_DSN=$SENTRY_DSN \
--build-arg PUBLIC_ASSETS_URL=$PUBLIC_ASSETS_URL \
-t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .