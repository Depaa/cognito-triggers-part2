import { App, Stack, StackProps } from 'aws-cdk-lib';
import { BlockPublicAccess, Bucket, BucketEncryption, HttpMethods } from 'aws-cdk-lib/aws-s3';
import { BuildConfig } from '../lib/common/config.interface';
import { name } from '../lib/common/utils';

export class UserBucketStack extends Stack {
  public readonly usersBucket: Bucket;

  constructor(scope: App, id: string, props: StackProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    this.usersBucket = this.createBucket(name(`${id}`));
  }

  private createBucket(name: string): Bucket {
    return new Bucket(this, name, {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      bucketName: name,
      encryption: BucketEncryption.S3_MANAGED,
      cors: [
        {
          allowedMethods: [
            HttpMethods.GET,
            HttpMethods.POST,
            HttpMethods.PUT,
          ],
          allowedOrigins: ['http://localhost:3000'],
          allowedHeaders: ['*'],
        },
      ],
    });
  }
}