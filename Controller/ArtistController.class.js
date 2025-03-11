import Controller from './Controller.class.js';

class ArtistController extends Controller
{
    static async getArtistByName(req, res)
    {
        Controller.db.query("SELECT * FROM artists WHERE name = ?", );
    }
}