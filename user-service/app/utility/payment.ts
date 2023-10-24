import { CreatePaymentSessionInput } from "../models/dto/CreatePaymentSessionInput";
import Stripe from "stripe";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;

export const APPLICATION_FEE = (totalAmount: number) => {
	const appFee = 1.5; // application fee in %
	return (totalAmount / 100) * appFee;
};

export const STRIPE_FEE = (totalAmount: number) => {
	const perTransaction = 2.9; // 2.9 % per transaction
	const fixCost = 0.29; // 29 cents
	const stripeCost = (totalAmount / 100) * perTransaction;
	return stripeCost + fixCost;
};

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: "2023-10-16",
});
