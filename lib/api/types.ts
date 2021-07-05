type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

// Facettes

export const allFacettes = [
	"support_groupe",
	"date_parution_annee",
	"auteurs",
	"types_nature",
	"emplacement",
] as const;

export type ElemOf<A extends readonly unknown[]> = A[number];
export type Facette = ElemOf<typeof allFacettes>;

export type FacetteSupportGroups = LiteralUnion<
	"Livres" | "Revues, journaux, magazines" | "Sites internet" | "Vidéos"
>;

// Json Web Token
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

// Info endpoint

export interface InstitutionInfo {
	titre: string;
	"sous-titre": string;
	"cms-public": boolean;
	"site-etablissement": string;
	reseausocial_pearltrees: string | null;
	reseausocial_facebook: string | null;
	reseausocial_instagram: string | null;
	reseausocial_pinterest: string | null;
	reseausocial_scoopit: string | null;
	reseausocial_twitter: string | null;
	reseausocial_youtube: string | null;
	"marguerite-resultats": true;
	"historique-notices": true;
	"historique-recherches": true;
	"partage-mail": true;
	"partage-citations": true;
	wikipedia: false;
	avis: true;
	avis_federes: true;
	reservations: "aucun";
	"catalogues-autres": null;
	/**
	 * @example "livresfiction_simple|livresfiction2_genre|livresdoc_dewey|revjourmag_alpha"
	 */
	"catalogues-guides": string;
	/**
	 * @example "support_groupe|date_parution_annee|auteurs|types_nature|emplacement"
	 */
	facettes: string;
	/**
	 * @example "6"
	 */
	"rss-limite": string;
	/**
	 * @example "1"
	 */
	"partage-reseauxsociaux": string;
}

// Search endpoint
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
	nb_resultats: number;
	avis_federes: "1";
	numero_premier_resultat: number;
}

export interface SearchRes {
	facettes?: Record<Facette, [category: string, quantity: number][]>;
	nb_resultats: number;
	resultats: Resultat[];
}
// - High level
export interface Query {
	query: string;
	quantity: number;
	startFrom: number;
}
