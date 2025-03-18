import Controller from './Controller.class.js';
import SongController from './SongController.class.js';
import ArtistController from "./ArtistController.class.js";

class AlbumController extends Controller
{
    static instance;

    async getAlbumById(req, res)
    {
        let query = await this.query(
            "SELECT a.*, artists.name AS artist, artists.idArtist " +
                        "FROM albums a " +
                        "LEFT JOIN albums_artists a_a USING (idAlbum) " +
                        "LEFT JOIN artists USING (idArtist) " +
                        "WHERE idAlbum = ?",
            [req.params.idAlbum]
        );

        if(query.hasResults) {
            let album = query.results[0];

            let songController = SongController.getInstance();
            album.songs = await songController.getSongsByIdAlbum(req.params.idAlbum);

            res.json(album);
        }
        else
        {
            res.status(404);
            res.json({error:"No Album found"});
        }
    }

    async getAlbumsByArtistId(idArtist)
    {
        return (await this.query(
            "SELECT a.name, a.idAlbum, COUNT(a_s.idSong) AS songCount " +
            "FROM albums_artists aa " +
            "LEFT JOIN albums a USING (idAlbum) " +
            "LEFT JOIN albums_songs a_s USING (idAlbum) " +
            "WHERE aa.idArtist = ? " +
            "GROUP BY a_s.idAlbum",
            [idArtist]
        )).results;
    }

    async addAlbum(req, res)
    {
        await this.beginTransaction();

        let albumQuery = await this.query(
            "INSERT INTO albums (name, releaseYear, numberListens) VALUES (?, ?, ?)",
            [req.body.name, req.body.releaseYear, req.body.numberListens]
        );

        let joinerQry = await this.query(
            "INSERT INTO albums_artists (idAlbum, idArtist) VALUES (?, ?)",
            [albumQuery.results.insertId, req.body.idArtist]
        );

        await this.commit();

        res.json(
            {idAlbum:albumQuery.results.insertId}
        );
    }

    async deleteAlbum(req, res)
    {
        await this.beginTransaction();

        await this.query(
            "DELETE FROM albums_artists WHERE idAlbum = ?",
            [req.params.idAlbum]
        );

        await this.query(
            "DELETE FROM albums WHERE idAlbum = ?",
            [req.params.idAlbum]
        );

        await this.commit();
        res.json({success:true})
    }

    async getAlbumsStartingWith(req, res)
    {
        let albums = await this.query(
            "SELECT idAlbum, name FROM albums WHERE name LIKE ?",
            [req.params.startingWith+"%"]
        );
        res.json(albums.results);
    }

    async updateAlbum(req, res)
    {
        let artistController = ArtistController.getInstance();
        let album = req.body;
        let artist = await artistController.getArtistByName(album.artist);

        if(!artist)
        {
            res.json({error: "No artist found"});
            return;
        }
        album.idArtist = artist.idartist;

        let updateAlbumQuery = await this.query(
            "UPDATE albums SET name = ?, releaseYear = ?, numberListens = ? WHERE idAlbum = ?",
            [album.name, album.releaseYear, album.numberListens, album.idalbum]
        );

        let updateArtistQuery = await this.query(
            "UPDATE albums_artists SET idArtist = ? where idAlbum = ?",
            [album.idArtist, album.idalbum]
        );

        res.json(album);
    }

    static getInstance()
    {
        if(!AlbumController.instance)
        {
            AlbumController.instance = new AlbumController();
        }
        return AlbumController.instance;
    }
}

export default AlbumController;