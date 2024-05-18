#!/bin/bash
docker build \
--build-arg NODE_ENV='production' \
--build-arg PORT='8080' \
--build-arg DATABASE_URI=${{ env.DATABASE_URI }} \
--build-arg S3_BUCKET_NAME=${{ env.S3_BUCKET_NAME }} \
--build-arg AWS_ACCESS_KEY_ID=${{ env.AWS_ACCESS_KEY_ID }} \
--build-arg AWS_SECRET_ACCESS_KEY=${{ env.AWS_SECRET_ACCESS_KEY }} \
--build-arg AWS_REGION=${{ env.AWS_REGION }} \
--build-arg JWT_SECRET=${{ env.JWT_SECRET }} \
--build-arg MAX_FILE_SIZE=${{ env.MAX_FILE_SIZE }} \
--build-arg MAX_FILES=${{ env.MAX_FILES }} \
--build-arg SENTRY_DSN=${{ env.SENTRY_DSN }} \
--build-arg PUBLIC_ASSETS_URL=${{ env.PUBLIC_ASSETS_URL }} \
-t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .