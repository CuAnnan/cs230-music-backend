import express from 'express';
import ArtistController from '../Controller/ArtistController.class.js';
import GenreController from '../Controller/GenreController.class.js';

const router = express.Router();
let controller = ArtistController.getInstance();
let genreController = GenreController.getInstance();


router.get("/startingWith/:startingWith", (req, res, next)=>{
    controller.getArtistsStartingWith(req, res).catch(next);
});

router.get('/:idArtist', (req, res, next)=>{
    controller.getArtist(req, res).catch(next);
})

router.delete('/:idArtist', (req, res, next)=>{
    controller.deleteArtist(req, res).catch(next);
});


router.post('/', (req, res, next)=>{
    controller.addArtist(req, res).then((newArtist)=>{
        genreController.addGenresToArtist(newArtist.insertId, req.body.genres).then(
            ()=> {
                res.json({
                    success: true,
                    idArtist: newArtist.insertId
                });
            }
        )
    }).catch(next);
});

router.patch('/', (req, res, next)=>{
    genreController.updateGenresForArtist(req, res)
        .then(()=>{
            controller.updateArtist(req, res).catch(next);
        }).catch(next);
});

export default router;