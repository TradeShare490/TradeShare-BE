/* eslint-disable camelcase */
export interface UserNode{
    userId: string
    lastFetchedAlpacaActivityId: string
    lastAlpacaFetch: string
}

export interface RelationshipFollows{
    id: string,
    isPending: boolean
}

export interface ActivityNode{
	alpacaId: string,
	activity_type: string,
	transaction_time: string,
	type: string,
	price: string,
	qty: string,
	side: string,
	symbol: string,
	leaves_qty: string,
	order_id: string,
	cum_qty: string,
	order_status: string
}
