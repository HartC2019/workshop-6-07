import express from "express";
import { getTracks, getTrack } from "../db/queries/tracks.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const tracks = await getTracks();
    res.send(tracks);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.sendStatus(400);
    }

    const track = await getTrack(id);

    if (!track) {
      return res.sendStatus(404);
    }

    res.send(track);
  } catch (err) {
    next(err);
  }
});

export default router;
