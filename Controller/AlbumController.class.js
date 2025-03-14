import Controller from './Controller.class.js';


class AlbumController extends Controller {
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

}

export default AlbumController;