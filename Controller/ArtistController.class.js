import Controller from './Controller.class.js';

class ArtistController extends Controller
{
    async getArtistByName(req, res)
    {
        let artist = await this.query("SELECT * FROM artists WHERE name = ?", [req.params.artistName]);
        res.json(artist);
    }

    async getArtistsStartingWith(req, res)
    {
        let artists = await this.query("SELECT idArtist, name FROM artists WHERE name LIKE ?", [req.params.startingWith+"%"]);
        res.json(artists);
    }
}

export default ArtistController;