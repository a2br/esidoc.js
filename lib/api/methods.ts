import fetch from "node-fetch";
import jwt_decode from "jwt-decode";
import * as T from "./types";

const url = (institution: string) =>
	`https://${
		institution.toLowerCase() /* Not necessary, just safety */
	}.esidoc.fr`;

export function tokenNeedsRefresh(token: string): boolean {
	const decoded = jwt_decode(token);
	if (!T.isValidPayload(decoded)) throw new Error("Invalid payload");
	const now = Math.round(new Date().getTime() / 1000);
	return now >= decoded.exp;
}

// Get token
export async function fetchToken(institution: string): Promise<string> {
	const root = url(institution);
	const res = await fetch(root);
	const txt = await res.text();

	const tokenRegex =
		/(?<=sessionStorage.setItem\('Esidocpublictoken',")(.*)+?(?="\);)/;
	const noise = /\t|\r|\n| /g;

	const clean = txt.replace(noise, "");
	const sessIndex = clean.indexOf("sessionStorage.setItem");
	const startIndex =
		sessIndex + "sessionStorage.setItem('Esidocpublictoken',\"".length;
	const rest = clean.substr(startIndex);
	const endIndex = rest.indexOf('");');
	const token = rest.substring(0, endIndex);
	if (!token) throw new Error("No token");
	return token;
}

const getHeaders = (token: string) => ({
	Connection: "keep-alive",
	"sec-ch-ua":
		'" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
	Accept: "application/json, text/javascript, */*; q=0.01",
	"sec-ch-ua-mobile": "?0",
	"User-Agent":
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
	Esidocpublictoken: token,
	"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
	Origin: "https://0570216a.esidoc.fr",
	"Sec-Fetch-Site": "same-site",
	"Sec-Fetch-Mode": "cors",
	"Sec-Fetch-Dest": "empty",
	Referer: "https://0570216a.esidoc.fr/",
	"Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
});

export function buildQueryReq(query: T.Query): T.SearchReq {
	const req: T.SearchReq = {
		requete: [
			{
				critere: "tous",
				valeur: query.query,
				operateur: "ET",
			},
		],
		facettes: T.allFacettes as any,
		nb_resultats: query.quantity ?? 10,
		avis_federes: "1",
		numero_premier_resultat: query.startFrom ?? 1,
	};
	return req;
}

export async function query(
	req: T.SearchReq,
	institution: string,
	token: string
): Promise<T.SearchRes> {
	const url = `https://api-recherche.esidoc.fr/recherche/simple/${institution.toUpperCase()}`;
	const headers = getHeaders(token);
	const res = await fetch(url, {
		headers,
		method: "POST",
		body: JSON.stringify(req),
	});
	const json: T.SearchRes = await res.json();
	return json;
}
