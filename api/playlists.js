import express from "express";

import {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  getPlaylistTracks,
  addTrackToPlaylist,
} from "../db/queries/playlists.js";

import { getTrack } from "../db/queries/tracks.js";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const playlists = await getPlaylists();
    res.send(playlists);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.body) {
      return res.sendStatus(400);
    }

    const { name, description } = req.body;

    if (!name || !description) {
      return res.sendStatus(400);
    }

    const playlist = await createPlaylist({
      name,
      description,
    });

    res.status(201).send(playlist);
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

    const playlist = await getPlaylist(id);

    if (!playlist) {
      return res.sendStatus(404);
    }

    res.send(playlist);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/tracks", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.sendStatus(400);
    }

    const playlist = await getPlaylist(id);

    if (!playlist) {
      return res.sendStatus(404);
    }

    const tracks = await getPlaylistTracks(id);

    res.send(tracks);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/tracks", async (req, res, next) => {
  try {
    const playlistId = Number(req.params.id);

    if (isNaN(playlistId)) {
      return res.sendStatus(400);
    }

    if (!req.body) {
      return res.sendStatus(400);
    }

    const { trackId } = req.body;

    if (trackId === undefined) {
      return res.sendStatus(400);
    }

    if (isNaN(Number(trackId))) {
      return res.sendStatus(400);
    }

    const playlist = await getPlaylist(playlistId);

    if (!playlist) {
      return res.sendStatus(404);
    }

    const track = await getTrack(trackId);

    if (!track) {
      return res.sendStatus(400);
    }

    try {
      const playlistTrack = await addTrackToPlaylist({
        playlist_id: playlistId,
        track_id: trackId,
      });

      res.status(201).send(playlistTrack);
    } catch {
      // duplicate track in playlist
      res.sendStatus(400);
    }
  } catch (err) {
    next(err);
  }
});

export default router;
