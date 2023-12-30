import * as cdk from "aws-cdk-lib";

export interface S3StackProps extends cdk.StackProps {
  env: cdk.Environment;
  mode: string;
  route53: {
    domainName: string;
    hostedZoneName: string;
  };
  acm: {
    domainName: string;
    certificateARN: string;
  };
}
