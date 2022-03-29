/* eslint-disable no-mixed-spaces-and-tabs */
export interface CustomError extends Error{
    status: number
}

export class UnauthorizedError extends Error implements CustomError {
    status: number
    constructor () {
    	super('Your request is unauthorized. Please login or contact admin')
    	this.status = 403
    }
}

export class BadInputError extends Error implements CustomError {
    status: number
    constructor (msg = 'Unexpected error') {
    	super(msg)
    	this.status = 400
    }
}

export class InternalError extends Error implements CustomError {
    status: number
    constructor (msg = 'Unexpected error') {
    	super(msg)
    	this.status = 500
    }
}
