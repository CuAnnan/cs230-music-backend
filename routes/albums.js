import express from 'express';
const router = express.Router();
import AlbumController from "../Controller/AlbumController.class.js";
const controller = AlbumController.getInstance();

router.get('/:idAlbum', (req, res, next) => {
    controller.getAlbumById(req, res).catch(next);
});

router.post('/addAlbum', (req, res, next)=>{
    controller.addAlbum(req, res).catch(next);
});

router.get('/startingWith/:startingWith', (req, res, next) => {
    controller.getAlbumsStartingWith(req, res).catch(next);
});

export default router;