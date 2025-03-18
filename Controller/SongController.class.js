import Controller from "./Controller.class.js";

class SongController extends Controller
{
    static instance;

    async getSongsByIdAlbum(idAlbum)
    {
        return (await this.query(
        "SELECT s.idSong, s.name " +
                    "FROM songs s " +
                    "LEFT JOIN albums_songs a_s USING (idSong) " +
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

    async getSong(req, res)
    {
        let songQry = await this.query(
            "SELECT s.*, a.name AS albumName, a.idAlbum " +
                        "FROM songs s " +
                        "LEFT JOIN albums_songs a_s USING (idSong) " +
                        "LEFT JOIN albums a USING (idAlbum) " +
                        "WHERE s.idSong = ?",
            [req.params.idSong]
        );
        res.json(songQry.results[0]);
    }

    async addSong(req, res)
    {
        await this.beginTransaction();
        let addQuery = await this.query(
            "INSERT INTO songs SET name = ?, releaseYear = ?",
            [req.body.name, req.body.releaseYear]
        );
        let albumQuery = await this.query(
            "INSERT INTO albums_songs (idAlbum, idSong) VALUES (?, ?)",
            [req.body.idAlbum, addQuery.results.insertId]
        );
        await this.commit();
        res.json({
            success:true,
            idSong:addQuery.results.insertId
        });
    }

    async updateSong(req, res)
    {
        await this.beginTransaction();
        let song = req.body;

        await this.query(
            "UPDATE songs SET name = ?, releaseYear = ? WHERE idSong = ?",
            [song.name, song.releaseYear, song.idsong]
        );

        await this.commit();

        res.json({
            success:true
        });
    }

    async deleteSong(req, res)
    {
        await this.beginTransaction();

        await this.query(
            "DELETE FROM albums_songs WHERE idSong = ?",
            [req.params.idSong]
        );

        await this.query(
            "DELETE FROM songs WHERE idSong = ?",
            [req.params.idSong]
        );

        await this.commit();
        res.json({
            success:true
        });
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