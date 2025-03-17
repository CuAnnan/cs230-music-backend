import Controller from './Controller.class.js';
import AlbumController from './AlbumController.class.js';
import GenreController from './GenreController.class.js';
import express from 'express';

class ArtistController extends Controller
{
    static instance;

    /**
     * Method to get the entire Artist
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {Promise<void>}
     */
    async getArtist(req, res)
    {
        let artistQry = await this.query(
            "SELECT * FROM artists WHERE idArtist = ?",
            [req.params.idArtist]
        );
        let artist = artistQry[0];

        let genreController = GenreController.getInstance();
        let albumController = AlbumController.getInstance();

        artist.genres = await genreController.getGenresByIdArtist(req.params.idArtist);
        artist.albums = await albumController.getAlbumByArtistId(req.params.idArtist);

        res.json(artist);
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {Promise<void>}
     */
    async getArtistsStartingWith(req, res)
    {
        let artists = await this.query(
        "SELECT idArtist, name FROM artists WHERE name LIKE ?",
        [req.params.startingWith+"%"]
    );
        res.json(artists);
    }

    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {Promise<void>}
     */
    async addArtist(req, res)
    {
        return this.query(
            "INSERT INTO artists (name, monthlyListeners) VALUES (?,?)",
            [req.body.name, req.body.monthlyListeners]
        );
    }

    async deleteArtist(req, res)
    {
        let result = await this.query(
            "DELETE FROM artists WHERE idArtist = ?",
            [req.params.idArtist]
        );
        res.json(result);
    }

    async updateArtist(req, res)
    {
        //console.log(req);
        let result = await this.query(
            "UPDATE artists SET name = ?, monthlyListeners = ? WHERE idArtist = ?",
            [req.body.name, req.body.monthlyListeners, req.body.idartist]
        );
        res.json(result);
    }

    static getInstance()
    {
        if(!ArtistController.instance)
        {
            ArtistController.instance = new ArtistController();
        }
        return ArtistController.instance;
    }
}

export default ArtistController;