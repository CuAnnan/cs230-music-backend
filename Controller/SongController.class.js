import Controller from "./Controller.class.js";

class SongController extends Controller
{
    static instance;

    async getSongsByIdAlbum(idAlbum)
    {
        return (await this.query(
        "SELECT s.idSong, s.name " +
                    "FROM songs s LEFT JOIN " +
                    "albums_songs a_s USING (idSong) " +
                    "WHERE a_s.idAlbum = ?",
                    [idAlbum]
        )).results;
    }

    async getSongsStartingWith(req, res)
    {
        let albums = await this.query(
            "SELECT idSong, name FROM songs WHERE name LIKE ?",
            [req.params.startingWith+"%"]
        );
        res.json(albums.results);
    }

    async getSongById(req, res)
    {
        let songQry = await this.query(
            "SELECT * FROM songs WHERE idSong = ?",
            [req.params.idSong]
        );
        res.json(songQry.results[0]);
    }

    async addSong(req, res)
    {

    }

    static getInstance()
    {
        if(!SongController.instance)
        {
            SongController.instance = new SongController();
        }
        return SongController.instance;
    }
}

export default SongController;