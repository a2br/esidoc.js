type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

export type Facette =
	| "support_groupe"
	| "date_parution_annee"
	| "auteurs"
	| "types_nature"
	| "emplacement";

export type strnum = `${number}`;
export type esinum = number | strnum;

export type FacetteSupportGroups = LiteralUnion<
	"Livres" | "Revues, journaux, magazines" | "Sites internet" | "Vidéos"
>;

export interface EsidocTokenPayload {
	iss: "esidoc";
	/**
	 * @description Expiration epoch in seconds
	 */
	exp: number;
	/**
	 * @description Upper-case instituion
	 */
	institution: string;
	droits: ["PUBLIC"];
}

export function isValidPayload(
	payload: unknown
): payload is EsidocTokenPayload {
	return !!(
		payload &&
		typeof payload === "object" &&
		"iss" in payload &&
		(payload as Record<string, unknown>).iss === "esidoc"
	);
}

export interface Resultat {
	notice_id: string;
	contenu: {
		collation: string;
		collection: string;
		/**
		 * @example "2011-03-14"
		 */
		date_modification: string;
		/**
		 * @example "2010-09"
		 */
		date_parution: string;
		/**
		 * @example "2010-12-21"
		 */
		date_saisie: string;
		/**
         * @example [
			"Christie, Agatha : 1891-1976",
			"Écrivain",
			"Angleterre",
			"20e siècle"
		]
         */
		descripteurs: string[];
		editeurs: string[];
		/**
		 * @example "1760-2300"
		 */
		issn: string;
		langue: string[];
		/**
		 * @example "Article de périodique"
		 */
		natures: string[];
		/**
		 * @example "077"
		 */
		no_collection: "077";
		resume: string;
		source: string;
		support: string;
		titre: string;
		/**
		 * @example "Texte imprimé"
		 */
		type_doc: string;
		/**
		 * @example "Article"
		 */
		type_notice: string;
		/**
		 * @example ["Documentaire"]
		 */
		types_nature: string[];
		permalien: string;
	};
	notice_generale: {
		notice_id: string;
		/**
		 * @example "2010-09"
		 */
		date_parution: string;
		/**
		 * @example "Virgule n°77"
		 */
		titre: string;
		permalien: string;
		exemplaires: {
			/**
			 * @example "22350"
			 */
			no_exemplaire: string;
			/**
			 * @example "Disponible"
			 */
			disponibilite: string;
			/**
			 * @example 1
			 */
			reservable: number;
			/**
			 * @example "Archive"
			 */
			emplacement: string;
		}[];
	};
	/**
	 * @example 4
	 */
	notices_soeurs: number;
	image: string;
}

export interface SearchReq {
	requete: [
		{
			critere: "tous";
			valeur: string;
			operateur: "ET";
		}
	];
	facettes: Facette[];
	nb_resultats: esinum;
	avis_federes: "1";
	numero_premier_resultat: esinum;
}

export interface Query {
	query: string;
	quantity: number;
	startFrom: number;
}

export interface SearchRes {
	facettes?: Record<Facette, [category: string, quantity: number][]>;
	nb_resultats: number;
	resultats: Resultat[];
}
