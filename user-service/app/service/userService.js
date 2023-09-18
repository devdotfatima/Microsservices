import { SucessResponse } from "../utility/response.js";

export class UserService {
	constructor() {}
	async CreateUser(event) {
		return SucessResponse({ message: "response form USer created" });
	}
}
