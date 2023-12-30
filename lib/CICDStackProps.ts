import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";

export interface CICDStackProps extends cdk.StackProps {
  env: cdk.Environment;
  mode: string;
  bucket: s3.IBucket;
  githubInfo: {
    gitOwner: string;
    gitRepository: string;
    branch: string;
  };
  connectionARN: string;
  webEnv: {
    baseUrl?: string;
  };
  distributionId?: string;
}
