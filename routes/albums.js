import express from 'express';
const router = express.Router();
import AlbumController from "../Controller/AlbumController.class.js";
const controller = new AlbumController();

router.get('/:idAlbum', (req, res, next) => {
    controller.getAlbumById(req, res).catch(next);
});

export default router;