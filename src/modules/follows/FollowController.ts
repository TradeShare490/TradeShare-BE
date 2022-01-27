import { Request, Response } from "express";
import FollowService from "./FollowService";

class FollowController {
	private followService: FollowService;
	constructor() {
		this.followService = new FollowService();
	}

	async getFollows(req: Request, res: Response) {
		const userId = req.params.userId || "-1";
		const response = await this.followService.getFollows(userId);
		return response.success ? res.send(response.data) : res.status(400).send(response);
	}

	async getFollowers(req: Request, res: Response) {
		const userId = req.params.userId || "-1";
		const response = await this.followService.getFollowers(userId);
		return response.success ? res.send(response.data) : res.status(400).send(response);
	}

	async follows(req: Request, res: Response) {
		const actorId = req.body.actorId || "-1";
		const targetId = req.body.targetId || "-1";
		const response = await this.followService.follow(actorId, targetId);
		return response.success ? res.send(response.data) : res.status(400).send(response);
	}

	async unfollows(req: Request, res: Response) {
		const actorId = req.body.actorId || "-1";
		const targetId = req.body.targetId || "-1";
		const response = await this.followService.unFollow(actorId, targetId);
		return response.success ? res.send(response.data) : res.status(400).send(response);
	}
}

export default FollowController;
