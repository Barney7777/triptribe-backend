#!/bin/bash
docker build \
--build-arg NODE_ENV='production' \
--build-arg PORT='8080' \
--build-arg DATABASE_URI=${{ secrets.DATABASE_URI }} \
--build-arg S3_BUCKET_NAME=${{ secrets.S3_BUCKET_NAME }} \
--build-arg AWS_ACCESS_KEY_ID=${{ secrets.AWS_ACCESS_KEY_ID }} \
--build-arg AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY }} \
--build-arg AWS_REGION=${{ secrets.AWS_REGION }} \
--build-arg JWT_SECRET=${{ secrets.JWT_SECRET }} \
--build-arg MAX_FILE_SIZE=${{ secrets.MAX_FILE_SIZE }} \
--build-arg MAX_FILES=${{ secrets.MAX_FILES }} \
--build-arg SENTRY_DSN=${{ secrets.SENTRY_DSN }} \
--build-arg PUBLIC_ASSETS_URL=${{ secrets.PUBLIC_ASSETS_URL }} \
-t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .