import * as T from "./types";
import * as M from "./methods";

export class Esidoc {
	public token: string | undefined;
	constructor(public institution: string) {}

	async init() {
		await this._refreshToken();
	}
	async _refreshToken(force = false): Promise<boolean> {
		if (force || !this.token || M.tokenNeedsRefresh(this.token)) {
			const token = await M.fetchToken(this.institution);
			this.token = token;
			return true;
		} else return false;
	}
	async query(query: T.Query) {}
}
