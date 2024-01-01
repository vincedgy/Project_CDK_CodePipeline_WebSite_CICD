# Welcome this CDK TypeScript project

This is a blank project for CDK development with TypeScript.

As usual the `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template


### Mono Environment Deploy the CICD for the dev environnement 

You have to set the MODE before launching the `cdk deploy` command for all or the appropriate Stack


```sh
MODE=dev cdk deploy --all
```

```sh
MODE=dev cdk deploy my-web-app-dev-cicd
```

### GitHub Integration

Create your access token in GitHub and save them in CodeBuild

https://docs.aws.amazon.com/codebuild/latest/userguide/access-tokens.html

```sh
aws codebuild import-source-credentials --server-type GITHUB --auth-type PERSONAL_ACCESS_TOKEN --token <<Token>>
```

## Multi environement deployment

> [AWS Summit ASEAN 2022 - Simplifying Multi-Environment Deployment with CDK Pipelines (GOB203)](https://youtu.be/D4TVphcvOoY?si=sxYZiRO57dEJnMAU)

In a multi AWS account context, you probably want to centralise all DevOps actions in a single 'SHARED' or 'Tooling' AWS Account.
Your final goal would be probably for your developers to be concentrated on simple "git" command and leave the rest to the DevOps toolchain.
Adopting this approach serves the goals of an Internal Developer Platform in a Cloud Environment context such as AWS can be.

For deploying this DevOps Pipeline in this context you'll need to set the AWS account id (AWS_SHARED_DEVOPS_ACCOUNT) and the related region which designate the account in which all DevOps operations will be centraly executed.

Please at this informations in the variables AWS_TARGET_ACCOUNT and AWS_TARGET_ACCOUNT_REGION, 
then bootstrap with the following command which will create the "CDKToolkit" CloudFormation stack for you in the designated account.

AWS CLI will use profiles : 
- tooling : the profile which targets the AWS account centralizing DevOps activities
- dev : the profile which target the AWS account for dev 
- stg : the profile which target the AWS account for stg

Example of deploying centralized CDKToolkit

```sh
(base) ➜  cdk git:(main) ✗  export AWS_SHARED_DEVOPS_ACCOUNT=122504097196 \
export AWS_SHARED_DEVOPS_REGION=eu-west-1

(base) ➜  cdk git:(main) ✗ CDK_NEW_BOOSTRAP=1 cdk bootstrap --profile tooling \
--cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
aws://${AWS_SHARED_DEVOPS_ACCOUNT}/${AWS_SHARED_DEVOPS_REGION}

current credentials could not be used to assume 'arn:aws:iam::122504097196:role/cdk-hnb659fds-lookup-role-122504097196-eu-west-1', but are for the right account. Proceeding anyway.
 ⏳  Bootstrapping environment aws://122504097196/eu-west-1...
Trusted accounts for deployment: (none)
Trusted accounts for lookup: (none)
Execution policies: arn:aws:iam::aws:policy/AdministratorAccess
CDKToolkit: creating CloudFormation changeset...
 ✅  Environment aws://122504097196/eu-west-1 bootstrapped.
```

Example of deployement of CDKToolkit on dev AWS account with trust on centralized "tooling"

```sh
(base) ➜  cdk git:(main) ✗ export AWS_TARGET_ACCOUNT=686618528250
export AWS_TARGET_ACCOUNT_REGION=eu-west-1

cdk bootstrap --profile dev \
--cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess \
--trust ${AWS_SHARED_DEVOPS_ACCOUNT} aws://${AWS_TARGET_ACCOUNT}/${AWS_TARGET_ACCOUNT_REGION}

current credentials could not be used to assume 'arn:aws:iam::686618528250:role/cdk-hnb659fds-lookup-role-686618528250-eu-west-1', but are for the right account. Proceeding anyway.
 ⏳  Bootstrapping environment aws://686618528250/eu-west-1...
Trusted accounts for deployment: 122504097196
Trusted accounts for lookup: (none)
Execution policies: arn:aws:iam::aws:policy/AdministratorAccess
CDKToolkit: creating CloudFormation changeset...
 ✅  Environment aws://686618528250/eu-west-1 bootstrapped.

```
