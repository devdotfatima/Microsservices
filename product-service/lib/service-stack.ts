import { Duration } from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
	NodejsFunction,
	NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";
import { ServiceInterface } from "./serviceInterface";

interface ServiceProps {
	bucket: string;
}

export class ServiceStack extends Construct {
	public readonly services: ServiceInterface;

	constructor(scope: Construct, id: string, props: ServiceProps) {
		super(scope, id);

		const nodeJsFunctionProps: NodejsFunctionProps = {
			bundling: {
				externalModules: ["aws-sdk"],
			},
			environment: {
				BUCKET_NAME: props.bucket,
			},
			runtime: Runtime.NODEJS_16_X,
			timeout: Duration.seconds(30),
		};
		this.services = {
			createProduct: this.createHandlers(nodeJsFunctionProps, "createProduct"),
			editProduct: this.createHandlers(nodeJsFunctionProps, "editProduct"),
			deleteProduct: this.createHandlers(nodeJsFunctionProps, "deleteProduct"),
			getProduct: this.createHandlers(nodeJsFunctionProps, "getProduct"),
			getProducts: this.createHandlers(nodeJsFunctionProps, "getProducts"),
			getSellerProducts: this.createHandlers(
				nodeJsFunctionProps,
				"getSellerProducts"
			),
			createCategory: this.createHandlers(
				nodeJsFunctionProps,
				"createCategory"
			),
			editCategory: this.createHandlers(nodeJsFunctionProps, "editCategory"),
			deleteCategory: this.createHandlers(
				nodeJsFunctionProps,
				"deleteCategory"
			),
			getCategory: this.createHandlers(nodeJsFunctionProps, "getCategory"),
			getCategories: this.createHandlers(nodeJsFunctionProps, "getCategories"),
			creatDeals: this.createHandlers(nodeJsFunctionProps, "createDeals"),
			imageUploader: this.createHandlers(nodeJsFunctionProps, "imageUploader"),
			messageQueueHandler: this.createHandlers(
				nodeJsFunctionProps,
				"messageQueueHandler"
			),
		};
	}

	createHandlers(props: NodejsFunctionProps, handler: string): NodejsFunction {
		return new NodejsFunction(this, handler, {
			entry: join(__dirname, "/../src/handlers/index.ts"),
			handler: handler,
			...props,
		});
	}
}
