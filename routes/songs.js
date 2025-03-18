import express from 'express';
import SongController from '../Controller/SongController.class.js';

const router = express.Router();
const controller = SongController.getInstance();

router.get('/:idSong', (req, res, next)=>{
    controller.getSong(req, res).catch(next);
});

router.patch('/:idSong', (req, res, next)=>{
    controller.updateSong(req, res).catch(next);
});

router.delete('/:idSong', (req, res, next)=>{
    controller.deleteSong(req, res).catch(next);
});

router.get("/startingWith/:startingWith", (req, res, next)=>{
    controller.getSongsStartingWith(req, res).catch(next);
});

router.post("/addSong", (req, res, next)=>{
    controller.addSong(req, res).catch(next);
});

export default router;