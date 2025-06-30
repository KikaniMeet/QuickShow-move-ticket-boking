import express from "express";
import {
  getNowPlayingMovie,
  addShow,
  getShows,
  getShow
} from "../controllers/showController.js";

const router = express.Router();

router.get("/now-playing", getNowPlayingMovie);
router.post("/add", addShow);           // ✅ POST method
router.get("/all", getShows);
router.get("/:movieId", getShow);

export default router;
