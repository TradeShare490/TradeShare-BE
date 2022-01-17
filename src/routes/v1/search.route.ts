import express, { Express } from "express";
import SearchController from "../../controllers/search.controller";

const searchRoute = (app: Express) => {
	const accountController = new SearchController();
	const router = express.Router();

	// All paths have the prefix /api/v1/session/

	router.get("/:searchString", async (req, res) => {
		await accountController.getStocksSuggestions(req, res);
	});

	app.use("/api/v1/searchRecommendations/", router);
};

export default searchRoute;