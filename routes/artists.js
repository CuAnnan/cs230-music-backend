import express from 'express';
import ArtistController from '../Controller/ArtistController.class.js';

const router = express.Router();
let controller = new ArtistController();


router.get("/startingWith/:startingWith", (req, res, next)=>{
    controller.getArtistsStartingWith(req, res).catch(next);
});

router.get('/:idArtist', (req, res, next)=>{
    controller.getArtist(req, res).catch(next);
})

router.delete('/:idArtist', (req, res, next)=>{
    controller.deleteArtist(req, res).catch(next);
});

router.put('/', (req, res, next)=>{
    controller.updateArtist(req, res).catch(next);
});

export default router;