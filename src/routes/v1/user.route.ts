import express, { Express, Request, Response } from "express";
import UserController from "../../controllers/user.controller";
import { createUserSchema } from "../../db/schema/user.schema";
import validateResource from "../../middleware/validateResource";
const userRoute = (app: Express) => {
	const userController = new UserController();
	console.log("test");
	console.log(userController);
	const router = express.Router();

	// All paths have the prefix /api/v1/account/

	router.post("/", validateResource(createUserSchema), userController.createUser);

	router.get("/:email", async (req: Request, res: Response, next) => {
		if (req.params.email && req.params.email.includes("@")) {
			res.send(await userController.getUser(req.params));
		} else next();
	});

	router.get("/:id", async (req: Request, res: Response) => {
		res.send(await userController.getUser(req.params));
	});

	router.patch("/:id", async (req: Request, res: Response) => {
		res.send(await userController.updateUser(req.params.id, req.body));
	});

	router.delete("/:id", async (req: Request, res: Response) => {
		res.send(await userController.deleteUser(req.params.id));
	});

	app.use("/api/v1/account/", router);
};

export default userRoute;
