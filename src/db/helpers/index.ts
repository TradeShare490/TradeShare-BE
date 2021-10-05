export interface ParsedParameters {
	find: any;
	skip: number;
	limit: number;
	sort?: string;
}

export const GLOBAL_QUERY_LIMIT = 50
