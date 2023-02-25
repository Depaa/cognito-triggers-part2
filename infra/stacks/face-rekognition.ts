import { App, Duration, Stack } from 'aws-cdk-lib';
import { Effect, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Architecture, Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { CfnCollection } from 'aws-cdk-lib/aws-rekognition';
import { BlockPublicAccess, Bucket, BucketEncryption, EventType, HttpMethods, IBucket } from 'aws-cdk-lib/aws-s3';
// import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { BuildConfig } from '../lib/common/config.interface';
import { name } from '../lib/common/utils';
import { FaceRekognitionProps } from '../lib/interfaces/face-rekognition-props';
import * as path from 'path';
import { LambdaDestination } from 'aws-cdk-lib/aws-s3-notifications';

export class FaceRekognitionStack extends Stack {
  public readonly faceCollection: CfnCollection;
  private readonly lambdaRole: Role;
  private readonly usersBucket: IBucket;

  constructor(scope: App, id: string, props: FaceRekognitionProps, buildConfig: BuildConfig) {
    super(scope, id, props);

    this.faceCollection = this.createCollection(name(`${id}-signup`));

    const baseEnv = {
      ACCOUNT_ID: buildConfig.account,
      REGION: buildConfig.region,
      USERS_TABLE: props.usersTable,
      COLLECTION_ID: this.faceCollection.collectionId
    };
    this.lambdaRole = this.createLambdaRole(`${id}-role`, props, buildConfig);
    const indexFaces = this.createLambdaFunction(name(`${id}-face-indexing`), 'face-indexing', baseEnv);

    this.usersBucket = Bucket.fromBucketArn(this, name(`${id}`), props.usersBucketArn);
    this.usersBucket.addEventNotification(EventType.OBJECT_CREATED, new LambdaDestination(indexFaces), { prefix: 'private/' });
  }

  private createCollection(name: string): CfnCollection {
    return new CfnCollection(this, name, {
      collectionId: name,
    });
  }


  private createLambdaFunction(name: string, filename: string, environment?: { [key: string]: string; }): Function {
    return new Function(this, name, {
      functionName: `${name}`,
      runtime: Runtime.NODEJS_16_X,
      timeout: Duration.seconds(30),
      code: Code.fromAsset(path.join(__dirname, `../../backend/src/lambdas/${filename}`)),
      handler: 'index.handler',
      role: this.lambdaRole,
      architecture: Architecture.ARM_64,
      environment,
    });
  }

  private createLambdaRole(name: string, props: FaceRekognitionProps, buildConfig: BuildConfig): Role {
    const lambdaRole = new Role(this, name, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaRole.attachInlinePolicy(new Policy(this, `${name}-lambda-basic-execution`, {
      policyName: `${name}-lambda-basic-execution`,
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
          ],
          resources: [
            '*',
          ]
        }),
      ]
    }));

    lambdaRole.attachInlinePolicy(new Policy(this, `${name}-dynamodb-users-table`, {
      policyName: `${name}-dynamodb-users-table`,
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'dynamodb:DeleteItem',
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:Query',
            'dynamodb:Scan',
            'dynamodb:UpdateItem',
          ],
          resources: [
            props.usersTableArn,
          ]
        }),
      ]
    }));

    lambdaRole.attachInlinePolicy(new Policy(this, `${name}-s3-users-bucket`, {
      policyName: `${name}-s3-users-bucket`,
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            's3:GetObject',
          ],
          resources: [
            '*',
          ]
        }),
      ]
    }));

    lambdaRole.attachInlinePolicy(new Policy(this, `${name}-face-rekognition`, {
      policyName: `${name}-face-rekognition`,
      statements: [
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: [
            'rekognition:IndexFaces',
          ],
          resources: [
            this.faceCollection.attrArn
          ]
        }),
      ]
    }));

    return lambdaRole;
  }
}
