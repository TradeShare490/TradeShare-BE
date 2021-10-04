import express, { Express, Request, Response } from "express";
import UserService from "../../services/User.service";

const userRoute = (app: Express) => {
	const userService = new UserService();
	const router = express.Router();

	// All paths have the prefix /api/v1/account/

	router.post("/", async (req: Request, res: Response) => {
		res.send(await userService.createUser(req.body));
	});

	router.get("/:email", async (req: Request, res: Response, next) => {
		if (req.params.email && req.params.email.includes("@")) {
			res.send(await userService.getUser(req.params));
		} else next();
	});

	router.get("/:id", async (req: Request, res: Response) => {
		res.send(await userService.getUser(req.params));
	});

	router.patch("/:id", async (req: Request, res: Response) => {
		res.send(await userService.updateUser(req.params.id, req.body));
	});

	router.delete("/:id", async (req: Request, res: Response) => {
		res.send(await userService.deleteUser(req.params.id));
	});

	app.use("/api/v1/account/", router);
};

export default userRoute;
