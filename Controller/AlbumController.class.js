import Controller from './Controller.class.js';


class AlbumController extends Controller
{
    static instance;

    async getAlbumById(req, res)
    {
        let results = await this.query(
            "SELECT a.*, artists.name AS artist, artists.idArtist " +
                        "FROM albums a " +
                        "LEFT JOIN albums_artists a_a USING (idAlbum) " +
                        "LEFT JOIN artists USING (idArtist) " +
                        "WHERE idAlbum = ?",
            [req.params.idAlbum]
        );
        let album = results[0];
        album.songs = [];
        let songs = await this.query(
            "SELECT s.idSong, s.name " +
            "FROM songs s LEFT JOIN " +
            "albums_songs a_s USING (idSong) " +
            "WHERE a_s.idAlbum = ?",
            [req.params.idAlbum]
        );
        for(let song of songs)
        {
            album.songs.push(song);
        }

        res.json(results[0]);
    }

    async getAlbumByArtistId(idArtist)
    {
        let albumsQry = await this.query(
            "SELECT a.name, a.idAlbum, COUNT(a_s.idSong) AS songCount " +
            "FROM albums_artists aa " +
            "LEFT JOIN albums a USING (idAlbum) " +
            "LEFT JOIN albums_songs a_s USING (idAlbum) " +
            "WHERE aa.idArtist = ? " +
            "GROUP BY a_s.idAlbum",
            [idArtist]
        );
        let albums = [];
        for(let album of albumsQry)
        {
            albums.push(album);
        }
        return albums;
    }

    async addAlbum(req, res)
    {
        let albumQuery = await this.query(
            "INSERT INTO albums (name, releaseYear, numberListens) VALUES (?, ?, ?)",
            [req.body.name, req.body.releaseYear, req.body.numberListens]
        );

        let joinerQry = await this.query(
            "INSERT INTO albums_artists (idAlbum, idArtist) VALUES (?, ?)",
            [albumQuery.insertId, req.body.idArtist]
        );
        res.json(
            {idAlbum:albumQuery.insertId}
        );
    }

    async getAlbumsStartingWith(req, res)
    {
        let albums = await this.query(
            "SELECT idAlbum, name FROM albums WHERE name LIKE ?",
            [req.params.startingWith+"%"]
        );
        res.json(albums);
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