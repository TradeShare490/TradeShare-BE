import { expect } from 'chai'
import AlpacaService from '../db/service/AlpacaService'

describe('Alpaca service can', () => {
	let alpacaService: AlpacaService
	const alpacaToken = '75320e3b-f7db-4d32-81e1-58b30d7a34bb'
	it('be set up', () => {
		alpacaService = new AlpacaService()
	})

	it('cant get anything with wrong alpacaToken', async () => {
		const response = await alpacaService.getInfo('/positions', 'positions', 'fakeAlpacaToken')
		expect(response.status).equals(501)
		expect(response.success).equals(false)
		expect(response.message).equals('request is not authorized')
	})

	it('get positions info', async () => {
		const response = await alpacaService.getInfo('/positions', 'positions', alpacaToken)
		expect(response.status).equals(200)
		expect(response.success).equals(true)
		expect(response.message).equals('success')
		expect(response.positions).to.be.an('Array')
	})

	it('get account info', async () => {
		const response = await alpacaService.getInfo('/account', 'account', alpacaToken)
		expect(response.status).equals(200)
		expect(response.success).equals(true)
		expect(response.message).equals('success')
		expect(response.account).not.equals(undefined)
	})

	it('get activities info', async () => {
		const response = await alpacaService.getInfo(
			'/account/activities/FILL',
			'activities',
			alpacaToken
		)
		expect(response.status).equals(200)
		expect(response.success).equals(true)
		expect(response.message).equals('success')
		expect(response.activities).to.be.an('Array')
	})
})
