import { StackProps } from 'aws-cdk-lib/core/lib/stack';

export interface FaceRekognitionProps extends StackProps {
  usersTableArn: string,
  usersBucketArn: string
  usersTable: string,
}