import { Request, Response } from 'express'
import BlockService from './BlockService'

class BlockController {
	private blockService: BlockService;
	constructor () {
		this.blockService = new BlockService()
	}

	async getBlockedUsers (req: Request, res: Response) {
		const userId = req.params.userId || '-1'
		const response = await this.blockService.getBlockedUsers(userId)
		return response.success ? res.send(response.data) : res.status(400).send(response)
	}

	async blockUser (req: Request, res: Response) {
		const actorId = req.body.actorId || '-1'
		const targetId = req.body.targetId || '-1'
		const response = await this.blockService.blockUser(actorId, targetId)
		return response.success ? res.send(response.data) : res.status(400).send(response)
	}

	async unblockUser (req: Request, res: Response) {
		const actorId = req.body.actorId || '-1'
		const targetId = req.body.targetId || '-1'
		const response = await this.blockService.unblockUser(actorId, targetId)
		return response.success ? res.send(response.data) : res.status(400).send(response)
	}
}

export default BlockController
