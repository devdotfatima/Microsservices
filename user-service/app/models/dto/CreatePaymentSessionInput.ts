export interface Address {
	address_line1: string;
	address_line2: string;
	city: string;
	post_code: string;
	country: string;
}
export interface CreatePaymentSessionInput {
	phone: string;
	email: string;
	amount: number;
	customerId?: string;
	customerName: string;
	customerAddress: Address;
}
