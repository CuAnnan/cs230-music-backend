import express from 'express';
import ArtistController from '../Controller/ArtistController.class.js';
import GenreController from '../Controller/GenreController.class.js';

const router = express.Router();
let controller = new ArtistController();
let genreController = new GenreController();


router.get("/startingWith/:startingWith", (req, res, next)=>{
    controller.getArtistsStartingWith(req, res).catch(next);
});

router.get('/:idArtist', (req, res, next)=>{
    controller.getArtist(req, res).catch(next);
})

router.delete('/:idArtist', (req, res, next)=>{
    controller.deleteArtist(req, res).catch(next);
});

router.patch('/', (req, res, next)=>{
    genreController.updateGenresForArtist(req, res)
        .then(()=>{
            controller.updateArtist(req, res).catch(next);
        }).catch(next);
});

export default router;