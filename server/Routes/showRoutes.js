import express from "express";
import { protectAdmin } from "../middleware/auth.js";
import { addShow, getNowPlayingMovie, getShow, getShows } from "../controllers/showController.js";

const showRouter = express.Router();

// Routes
showRouter.get('/now-playing', getNowPlayingMovie);
showRouter.post('/add', addShow);
showRouter.get("/all", getShows);
showRouter.get("/:movieId", getShow);

export default showRouter;
