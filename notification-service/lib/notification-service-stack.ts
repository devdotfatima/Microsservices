import * as cdk from "aws-cdk-lib";
import { SubscriptionFilter, Topic } from "aws-cdk-lib/aws-sns";
import { SqsSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { ServiceStack } from "./service-stack";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NotificationServiceStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const emailQueue = new Queue(this, "email_queue", {
			visibilityTimeout: cdk.Duration.seconds(120),
		});

		const otpQueue = new Queue(this, "otp_queue", {
			visibilityTimeout: cdk.Duration.seconds(120),
		});

		const topic = new Topic(this, "notification_topic");
		this.addSubscription(topic, emailQueue, ["customer_email"]);
		this.addSubscription(topic, otpQueue, ["customer_otp"]);
		const { emailHandler, otpHandler } = new ServiceStack(
			this,
			"notification_service",
			{}
		);
		emailHandler.addEventSource(new SqsEventSource(emailQueue));

		otpHandler.addEventSource(new SqsEventSource(otpQueue));

		new cdk.CfnOutput(this, "NotificationTopic", {
			value: topic.topicArn,
			exportName: "notifySvcArn",
		});
	}

	addSubscription(topic: Topic, queue: Queue, allowlist: string[]) {
		topic.addSubscription(
			new SqsSubscription(queue, {
				rawMessageDelivery: true,
				filterPolicy: {
					actionType: SubscriptionFilter.stringFilter({
						allowlist,
					}),
				},
			})
		);
	}
}
