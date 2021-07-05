import * as M from "./api/methods";
import * as T from "./api/types";

export class Esidoc {
	public token: string = "";
	constructor(public institution: string) {}

	async init() {
		await this._refreshToken(true);
	}
	async _refreshToken(force = false): Promise<boolean> {
		if (force || !this.token || M.tokenNeedsRefresh(this.token)) {
			const token = await M.fetchToken(this.institution);
			this.token = token;
			return true;
		} else return false;
	}
	async query(query: T.Query) {
		await this._refreshToken();
		// build req from query
		const req = M.buildQueryReq(query);
		const res = await M.query(query, this.institution, this.token);
	}
}

export default Esidoc;
export * from "./api";
