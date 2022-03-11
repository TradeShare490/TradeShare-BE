import { object, string } from 'zod'

export const createSessionSchema = object({
	body: object({
		email: string().optional(),
		username: string().optional(),
		password: string({
			required_error: 'Password is required'
		})
	})
})
