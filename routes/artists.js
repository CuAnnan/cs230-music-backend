import express from 'express';
import ArtistController from '../Controller/ArtistController.class.js';

const router = express.Router();
let controller = new ArtistController();


router.get("/startingWith/:startingWith", (req, res, next)=>{
    controller.getArtistsStartingWith(req, res).catch(next);
});

router.get('/:artistName', (req, res, next)=>{
    controller.getArtistByName(req, res).catch(next);
})

export default router;